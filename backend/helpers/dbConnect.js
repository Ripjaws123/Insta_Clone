import mongoose from "mongoose";

const dbConnect = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        if(conn.connection.readyState === 1){
            console.log('Database Connected Successfully');
        }
    } catch (error) {
        console.log('Error While Connecting the Database', error);
    }
}

export default dbConnect;