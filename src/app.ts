import express from 'express';
import * as dotenv from 'dotenv';
import { appRouter } from './api/controllers/app.controller';

dotenv.config();
export const app = express();

const jsonBody = express.json();

app.set('trust proxy', true);
app.use(jsonBody);
app.use('/', appRouter);

export const port = process.env.PORT || 5000;
