import { z } from "zod";

const dateStringToDate = (val: string) => {
  const parsedDate = new Date(val);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format");
  }
  return parsedDate;
};

// Task creation schema
export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid start date" })
    .transform(dateStringToDate),
  endTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid end date" })
    .transform(dateStringToDate),
  priority: z.number().min(1).max(5),
  status: z.enum(["pending", "finished"]).default("pending"),
  tags: z.array(z.string()).optional(),
});

// Task update schema
export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  startTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid start date" })
    .transform(dateStringToDate)
    .optional(),
  endTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid end date" })
    .transform(dateStringToDate)
    .optional(),
  priority: z.number().min(1).max(5).optional(),
  status: z.enum(["pending", "finished"]).optional(),
  tags: z.array(z.string()).optional(),
});
