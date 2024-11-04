import express, { Application } from 'express';
import { config } from 'dotenv';
import usersRoutes from './routes/users.routes';
import walletRoutes from './routes/wallet.routes';

config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// Routes
app.use('/api/v1/auth', usersRoutes);
app.use('/api/v1/wallet', walletRoutes);

export default app;