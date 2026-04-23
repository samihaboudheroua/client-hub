import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db, filesTable, requestsTable } from "@workspace/db";
import { ListRequestFilesParams } from "@workspace/api-zod";

const router: IRouter = Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

router.get("/requests/:id/files", async (req, res) => {
  const { id } = ListRequestFilesParams.parse({ id: Number(req.params.id) });
  const files = await db
    .select()
    .from(filesTable)
    .where(eq(filesTable.requestId, id))
    .orderBy(filesTable.createdAt);
  res.json(files);
});

router.post(
  "/requests/:id/files",
  upload.single("file"),
  async (req, res) => {
    const requestId = Number(req.params.id);

    const [request] = await db
      .select()
      .from(requestsTable)
      .where(eq(requestsTable.id, requestId));

    if (!request) {
      res.status(404).json({ error: "Request not found" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const [file] = await db
      .insert(filesTable)
      .values({
        requestId,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        storagePath: req.file.filename,
        description: req.body.description ?? null,
      })
      .returning();

    res.status(201).json(file);
  }
);

export default router;
