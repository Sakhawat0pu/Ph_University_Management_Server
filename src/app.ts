import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { studentRouter } from './app/module/students/student.route';
const app: Application = express();

// Parser
app.use(express.json());
app.use(express.text());
app.use(cors());

//

app.use('/api/v1/student', studentRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my Basic Express Mongoose Server');
});

export default app;
