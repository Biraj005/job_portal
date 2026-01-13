import express,{NextFunction,Request,Response} from 'express';
import authRoutes from './routes/auth.routes.js';
import { error } from 'node:console';


const app = express();

app.use(express.json());
app.use('/auth', authRoutes); 
app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      errors: err.errors || [],
    });
  }
);



export default app;