import 'reflect-metadata';
import App from './app';
import * as cronJobs from './cron-jobs';

process.on('uncaughtException', (err) => {
  console.error(`
    --------------------
    Unhandled Exception:
    ${err.message}
    --------------------
    `);
});

process.on('unhandledRejection', (err) => {
  console.error(`
    --------------------
    Unhandled Rejection:
    ${err.message}
    --------------------
    `);
});

const app: App = new App();
app.start();
export default app;

cronJobs.jobs.scheduleJob();