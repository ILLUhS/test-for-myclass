import { app, port } from './app';
import { Client } from 'pg';

const bootstrap = async (): Promise<void> => {
  const connectionString = '';
  const client = new Client({
    connectionString,
  });
  await client.connect();
  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};
bootstrap();
