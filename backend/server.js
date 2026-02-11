import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import db from './config/connection.js'
import errorHandle from './middleware/errorHandling.middleware.js'
import authRoutes from './routes/auth.routes.js'
import resumeRouter from './routes/resume.routes.js'

const app = express();
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173","https://airesumeana.netlify.app"],
    credentials:true
}));



app.use('/user',authRoutes);
app.use('/resume',resumeRouter);


app.use(errorHandle);
const PORT = process.env.PORT || 3003
app.listen(PORT, async () => {
    await db()
    console.log(`Server is running on ${PORT}`)
});
