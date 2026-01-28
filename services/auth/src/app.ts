import express,{NextFunction,Request,Response} from 'express';
import authRoutes from './routes/auth.routes.js';
import cookieParase from 'cookie-parser';
import cors from 'cors';

const app = express();



app.use(
  cors({
    origin: process.env.FRONTEND_URL as string,
    credentials: true, 
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParase());


app.use('/auth', authRoutes); 
app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
   
    console.log(err)
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      errors: err.errors || [],
    });
  }
);
export default app;