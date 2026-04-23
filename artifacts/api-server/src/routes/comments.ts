import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, commentsTable, requestsTable } from "@workspace/db";
import {
  ListRequestCommentsParams,
  AddRequestCommentBody,
  AddRequestCommentParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/requests/:id/comments", async (req, res) => {
  const { id } = ListRequestCommentsParams.parse({ id: Number(req.params.id) });
  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.requestId, id))
    .orderBy(commentsTable.createdAt);
  res.json(comments);
});

router.post("/requests/:id/comments", async (req, res) => {
  const { id } = AddRequestCommentParams.parse({ id: Number(req.params.id) });

  const [request] = await db
    .select()
    .from(requestsTable)
    .where(eq(requestsTable.id, id));

  if (!request) {
    res.status(404).json({ error: "Request not found" });
    return;
  }

  const body = AddRequestCommentBody.parse(req.body);

  const [comment] = await db
    .insert(commentsTable)
    .values({ ...body, requestId: id })
    .returning();

  res.status(201).json(comment);
});

export default router;
