import { Router } from 'express';
import { booksController } from '../controllers/books.controller';

export const bookRoutes = Router();

bookRoutes.get('/:id', booksController.getBookById);
