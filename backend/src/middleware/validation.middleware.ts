import type { Request, Response, NextFunction } from "express"
import type { ZodSchema } from "zod"

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body)
      next()
    } catch (error: any) {
      res.status(400).json({
        message: "Validation error",
        errors: error.errors?.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      })
    }
  }
}
