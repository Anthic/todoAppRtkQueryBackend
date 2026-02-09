import type { NextFunction, Request, Response } from "express";

export interface ValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  type?: "string" | "number" | "boolean";
}
export const validateResquest = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, string> = {};
    for (const rule of rules) {
      const value = req.body[rule.field];
      //required field check
      if (rule.required && !value) {
        errors[rule.field] = `${rule.field} is required`;
        continue;
      }
      //skip validation not required
      if (!value) continue;

      // Type check
      if (rule.type && typeof value !== rule.type) {
        errors[rule.field] = `${rule.field} must be ${rule.type}`;
        continue;
      }

      // String validations
      if (typeof value === "string") {
        if (rule.minLength && value.trim().length < rule.minLength) {
          errors[rule.field] =
            `${rule.field} must be at least ${rule.minLength} characters`;
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors[rule.field] =
            `${rule.field} must not exceed ${rule.maxLength} characters`;
        }
      }
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};
export const todoValidationRules = {
  create: [
    {
      field: "title",
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 255,
    },
  ],
  update: [
    { field: "title", type: "string", minLength: 1, maxLength: 255 },
    { field: "completed", type: "boolean" },
  ],
};
