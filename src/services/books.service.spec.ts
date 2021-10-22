import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { mockDeep } from 'jest-mock-extended';
import { dbClient } from '../database-client/database-client';
import { booksService } from './books.service';
import { RecordNotFoundError } from '../errors/record-not-found.error';
jest.mock('../database-client/database-client', () => ({ __esModule: true, dbClient: mockDeep<PrismaClient>() }));


describe('BooksService', () => {
  let book;

  beforeEach(() => {
    book = {id: '6169b0511aa28622af3ab77d', title: 'War and Peace', price: new Decimal(12.99)};
  });

  afterEach(() => {
    (dbClient.book.findUnique as jest.Mock).mockReset();
    (dbClient.book.findUnique as jest.Mock).mockReset();
    (dbClient.book.create as jest.Mock).mockReset();
    (dbClient.book.update as jest.Mock).mockReset();
  });

  describe('getBookById', () => {
    let id: string;

    beforeEach(() => {
      id = '6169b0511aa28622af3ab77d';
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

  describe('getBooksByParams', () => {
    beforeEach(() => {
      (dbClient.book.findMany as jest.Mock).mockResolvedValue([book]);
    });

    it('should make a call to the database to retrieve the books using the parameters', async() => {
      const author = 'Twain, Mark'
      const year_written = 1855;

      const result = await booksService.getBooksByParams({author, year_written});
    
      expect(dbClient.book.findMany).toHaveBeenCalledWith({where: {author, year_written}});
      expect(result).toEqual([book]);
    });

    it('should ensure the price is given to 2dp', async() => {
      book.price = new Decimal(12);
      const author = 'Twain, Mark'
      const year_written = 1855;

      const result = await booksService.getBooksByParams({author, year_written});

      expect(result[0].price).toEqual('12.00');
    });
  });

  describe('createBook', () => {
    beforeEach(() => {
      (dbClient.book.create as jest.Mock).mockResolvedValue(book);
    });

    it('should make a call to the database to create a new book entry', async() => {
      await booksService.createBook(book);

      expect(dbClient.book.create).toHaveBeenCalledWith({data: book});
    });
  });

  describe('updateBook', () => {
    beforeEach(() => {
      (dbClient.book.update as jest.Mock).mockResolvedValue(book);
    });

    it('should make a call to the database to update a book entry', async() => {
      await booksService.updateBook(book);

      expect(dbClient.book.update).toHaveBeenCalledWith({where: {id: book.id}, data: book});
    });

    it('should throw 404 exception when the item is not found in the db', async() => {
      const error = new Error();
      error['code'] = 'P2025';
      (dbClient.book.update as jest.Mock).mockRejectedValue(error);

      expect(async() => booksService.updateBook(book)).rejects.toThrowError(RecordNotFoundError);
    });
  });
});