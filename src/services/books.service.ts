import { Book } from '@prisma/client';
import { dbClient } from '../database-client/database-client';
import { RecordNotFoundError } from '../errors/record-not-found.error';

class BooksService {
  getBookById (id: string, ratings = false) {
    return dbClient.book.findUnique({where: {id}, include: {ratings}})
      .then((book) => this.ensurePriceIsTo2DP(book))
      .catch((error) => this.handleDBErrors(error, {id}));
  }

  getBooksByParams (params) {
    return dbClient.book.findMany({where: params} )
      .then((res) =>res.map(this.ensurePriceIsTo2DP))
      .catch((error) => this.handleDBErrors(error, params));
  }

  createBook(book: Book) {
    return dbClient.book.create({data: book});
  }

  updateBook(book: Book) {
    return dbClient.book.update({where: {id: book.id}, data: book})
      .catch((error) => this.handleDBErrors(error, {id: book.id}));
  }

  private handleDBErrors(error, params) {
    if (error.code = 'P2025') {
      throw new RecordNotFoundError({cause: error, message: error.message, searchParams: params});
    }
    throw error;
  }

  private ensurePriceIsTo2DP(book) {
    book.price = book.price.toFixed(2);
    return book;
  }
}

export const booksService = new BooksService();