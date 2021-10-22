import { Book } from '@prisma/client';
import { dbClient } from '../database-client/database-client';
import { RecordNotFoundError } from '../errors/record-not-found.error';

class BooksService {
  getBookById (id: string, ratings = false) {
    return dbClient.book.findUnique({where: {id}, include: {ratings}})
      .then((book) => this.ensurePriceIsTo2DP(book))
      .catch(this.handleDBErrors);
  }

  getBooksByParams (params) {
    return dbClient.book.findMany({where: params} )
      .then((res) =>res.map(this.ensurePriceIsTo2DP))
      .catch(this.handleDBErrors);
  }

  createBook(book: Book) {
    return dbClient.book.create({data: book});
  }

  updateBook(book: Book) {
    return dbClient.book.update({where: {id: book.id}, data: book})
      .catch(this.handleDBErrors);
  }

  private handleDBErrors(error) {
    if (error.code = 'P2025') {
      throw new RecordNotFoundError({cause: error, message: error.message});
    }
    throw error;
  }

  private ensurePriceIsTo2DP(book) {
    book.price = book.price.toFixed(2);
    return book;
  }
}

export const booksService = new BooksService();