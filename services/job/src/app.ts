import express,{NextFunction,Request,Response} from 'express';
import jobRoutes from './routes/job.route.js'
import cookieParase from 'cookie-parser';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParase());
app.use("/job",jobRoutes);

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