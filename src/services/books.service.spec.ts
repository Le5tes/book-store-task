import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { mockDeep } from 'jest-mock-extended';
import { dbClient } from '../database-client/database-client';
import { booksService } from './books.service';
jest.mock('../database-client/database-client', () => ({ __esModule: true, dbClient: mockDeep<PrismaClient>() }));

describe('BooksService', () => {
  describe('getBookById', () => {
    let id: string;
    let book;

    beforeEach(() => {
      id = '6169b0511aa28622af3ab77d';
      book = {id: '6169b0511aa28622af3ab77d', title: 'War and Peace', price: new Decimal(12.99)};
      (dbClient.book.findUnique as jest.Mock).mockResolvedValue(book);
    });

    it('should make a call to the database to retrieve the book', async() => {
      const result = await booksService.getBookById(id);
      
      expect(dbClient.book.findUnique).toHaveBeenCalledWith({where: {id}, include: {ratings: false}});
      expect(result).toEqual(book);
    });

    it('should make a call to the database to retrieve the book with the ratings, if called with the ratings parameter as true', async() => {
      await booksService.getBookById(id, true);
      
      expect(dbClient.book.findUnique).toHaveBeenCalledWith({where: {id}, include: {ratings: true}});
    });

    it('should ensure the price is given to 2dp', async() => {
      book = {id: '6169b0511aa28622af3ab77d', title: 'War and Peace', price: new Decimal(12)};
      (dbClient.book.findUnique as jest.Mock).mockResolvedValue(book);

      const result = await booksService.getBookById(id);

      expect(result.price).toEqual('12.00');
    });
  });
});