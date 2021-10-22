import { Router } from 'express';
import { booksController } from '../controllers/books.controller';
import { sanitiseBooksQueryParams, validateBookBody } from '../middlewares/validations/books.validators';
import asyncHandler from 'express-async-handler'

export const bookRoutes = Router();

bookRoutes.get('/', sanitiseBooksQueryParams(), asyncHandler(booksController.getBooksByParams));

bookRoutes.get('/:id', asyncHandler(booksController.getBookById));

bookRoutes.post('/', validateBookBody(), asyncHandler(booksController.createBook));

bookRoutes.put('/', validateBookBody(), asyncHandler(booksController.updateBook));
