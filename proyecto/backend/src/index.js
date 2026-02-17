console.log('Backend starting...');
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import campsRouter from './routes/camps.routes.js';
import enrollmentsRouter from './routes/enrollments.routes.js';
import authRouter from './routes/auth.routes.js';
import contactRouter from './routes/contact.routes.js';
import uploadRouter from './routes/upload.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const corsOrigin = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend', time: new Date().toISOString() });
});


app.use('/api/camps', campsRouter);
app.use('/api/enrollments', enrollmentsRouter);
app.use('/api/auth', authRouter);
app.use('/api/contact', contactRouter);
app.use('/api/upload', uploadRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor backend listo!`);
  console.log(`📡 Escuchando en: http://0.0.0.0:${PORT}`);
  console.log(`🌐 Acceso desde host: http://localhost:${PORT}`);
});



