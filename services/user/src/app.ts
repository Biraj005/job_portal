import express,{NextFunction,Request,Response} from 'express';
import cookieParase from 'cookie-parser';
import userRoutes from './routes/user.route.js'
import cors from 'cors';
const app = express();



app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, 
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParase());
app.use('/user',userRoutes);
app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      errors: err.errors || [],
    });
  }
);
export default app;