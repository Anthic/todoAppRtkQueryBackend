import type { NextFunction, Request, Response } from "express"

interface ApiError extends Error{
    statusCode?: number
    message: string

}

export const errorMiddleware =(err: ApiError, req: Request, res: Response, next: NextFunction)=>{
const statusCode = err.statusCode || 500
const message = err.message 
console.log(`[${new Date().toDateString()}] Erro ${statusCode} : ${message}`)
res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),

})


}
export class AppError extends Error{
    constructor(public statusCode : number,message: string){
        super(message)
        this.name = "AppError"
    }
}