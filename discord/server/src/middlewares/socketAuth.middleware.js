import { cookie } from "express-validator"
import ApiError from "../utils/ApiError.js"

export const socketAuthMiddleware = (socket , next)=>{
    try {
        const cookies =  socket.handshake.headers.cookie

        if(!cookies){
            throw new ApiError(404 , "authentication is required");
        }
    } catch (error) {
        next(error)
    }
}