import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, requestsTable, filesTable, commentsTable } from "@workspace/db";
import {
  CreateRequestBody,
  UpdateRequestBody,
  GetRequestParams,
  UpdateRequestParams,
  ListRequestsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/requests", async (req, res) => {
  const query = ListRequestsQueryParams.parse({
    projectId: req.query.projectId ? Number(req.query.projectId) : undefined,
    status: req.query.status,
  });

  const conditions = [];
  if (query.projectId !== undefined) {
    conditions.push(eq(requestsTable.projectId, query.projectId));
  }
  if (query.status !== undefined) {
    conditions.push(eq(requestsTable.status, query.status));
  }

  const requests = await db
    .select()
    .from(requestsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(requestsTable.createdAt);

  res.json(requests);
});

router.post("/requests", async (req, res) => {
  const body = CreateRequestBody.parse(req.body);
  const [request] = await db
    .insert(requestsTable)
    .values(body)
    .returning();
  res.status(201).json(request);
});

router.get("/requests/:id", async (req, res) => {
  const { id } = GetRequestParams.parse({ id: Number(req.params.id) });
  const [request] = await db
    .select()
    .from(requestsTable)
    .where(eq(requestsTable.id, id));

  if (!request) {
    res.status(404).json({ error: "Request not found" });
    return;
  }

  const files = await db
    .select()
    .from(filesTable)
    .where(eq(filesTable.requestId, id));

  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.requestId, id))
    .orderBy(commentsTable.createdAt);

  res.json({ ...request, files, comments });
});

router.patch("/requests/:id", async (req, res) => {
  const { id } = UpdateRequestParams.parse({ id: Number(req.params.id) });
  const body = UpdateRequestBody.parse(req.body);
  const [request] = await db
    .update(requestsTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(requestsTable.id, id))
    .returning();
  if (!request) {
    res.status(404).json({ error: "Request not found" });
    return;
  }
  res.json(request);
});

export default router;
