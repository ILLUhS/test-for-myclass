import express from 'express';

export const app = express();

const jsonBody = express.json();

app.set('trust proxy', true);
app.use(jsonBody);

export const port = 5000;
