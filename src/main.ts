import { app, port } from './app';
import { runDB } from './infrastructure/database';

const bootstrap = async (): Promise<void> => {
  try {
    await runDB();
    app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};
bootstrap();
