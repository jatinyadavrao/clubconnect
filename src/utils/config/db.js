import mongoose from "mongoose"

export const dbConnect = async()=>{
    try {
        if(mongoose.connections[0].readyState) return;
        await mongoose.connect(`${process.env.DB}/ClubConnectDB`)
        console.log("connected to DB Successfully")
    } catch (error) {
        console.log("Error in Connecting to DB",error)
    }
}