import { Request, Response, Router } from 'express';

export const appRouter = Router({});

appRouter.get('/', async (req: Request, res: Response) => {
  return res.sendStatus(200);
});
appRouter.post('/lessons', async (req: Request, res: Response) => {
  return res.sendStatus(201);
});
