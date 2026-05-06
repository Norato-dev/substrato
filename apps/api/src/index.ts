import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import postRoutes from './routes/post.routes';
import commentRoutes from './routes/comment.routes';
import userRoutes from './routes/user.routes';
import uploadRoutes from './routes/upload.routes';
import reactionRoutes from './routes/reaction.routes';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reactions', reactionRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'substrato-api' });
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🌱 Substrato API escuchando en http://localhost:${PORT}`);
});