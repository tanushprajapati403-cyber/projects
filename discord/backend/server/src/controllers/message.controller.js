export const createMessage = async (req , res , next)=>{
    try {
        const {channelId} = req.params;
        const {content , attachments} =  req.body;
    } catch (error) {
        next(error)
    }
}