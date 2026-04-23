import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { projectsTable } from "./projects";

export const requestStatusEnum = [
  "pending",
  "in_review",
  "in_progress",
  "needs_feedback",
  "completed",
  "cancelled",
] as const;

export const requestPriorityEnum = ["low", "medium", "high"] as const;

export const requestsTable = pgTable("requests", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projectsTable.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status")
    .$type<(typeof requestStatusEnum)[number]>()
    .notNull()
    .default("pending"),
  priority: text("priority")
    .$type<(typeof requestPriorityEnum)[number]>()
    .notNull()
    .default("medium"),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertRequestSchema = createInsertSchema(requestsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Request = typeof requestsTable.$inferSelect;
