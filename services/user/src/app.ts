import express,{NextFunction,Request,Response} from 'express';
import cookieParase from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParase());

// app.use('/auth'); 
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