import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { studentRouter } from './app/module/students/student.route';
import { userRouter } from './app/module/users/users.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
const app: Application = express();

// Parser
app.use(express.json());
app.use(express.text());
app.use(cors());

//

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my Basic Express Mongoose Server');
});

/* app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Path name is not valid',
  });
}); */

app.use(globalErrorHandler);
app.use(notFound);

export default app;
