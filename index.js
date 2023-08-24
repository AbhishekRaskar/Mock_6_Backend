const express = require("express")
const cors = require("cors");
const { connection } = require("./Config/db");
const { userRouter } = require("./Routes/userRoute");
const { blogRouter } = require("./Routes/blogRoute");
require("dotenv").config()



const app = express();
app.use(express.json());
app.use(cors())

app.use("/users", userRouter)
app.use("/blogs", blogRouter)

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log(`Server is running at port ${process.env.port}`);
        console.log("Connected to DB");
    } catch (error) {
        console.log(error.message);
    }
})