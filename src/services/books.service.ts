import { dbClient } from '../database-client/database-client';

class BooksService {
  async getBookById (id: string, ratings = false) {
    const book = await dbClient.book.findUnique({where: {id}, include: {ratings}});
    return this.ensurePriceIsTo2DP(book);
  }

  private ensurePriceIsTo2DP(book) {
    book.price = book.price.toFixed(2);
    return book;
  }
}

export const booksService = new BooksService();