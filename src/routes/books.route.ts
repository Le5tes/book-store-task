import { Router } from 'express';
import { booksController } from '../controllers/books.controller';
import { sanitiseBooksQueryParams } from '../middlewares/books.sanitisers';

export const bookRoutes = Router();

bookRoutes.get('/', sanitiseBooksQueryParams(), booksController.getBooksByParams);

bookRoutes.get('/:id', booksController.getBookById);
