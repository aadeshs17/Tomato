import mongoose from "mongoose";

 export const connectDB= async()=>
{
     mongoose.connect('mongodb+srv://aadeshsrivastava17:aadeshs17@cluster0.1ydvm7o.mongodb.net/food-del').then(()=> console.log("DB Connected"));
      
}