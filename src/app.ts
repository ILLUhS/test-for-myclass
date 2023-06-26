import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();
export const app = express();

const jsonBody = express.json();

app.set('trust proxy', true);
app.use(jsonBody);

export const port = process.env.PORT || 5000;
