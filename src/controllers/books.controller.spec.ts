import { booksService } from '../services/books.service';
import { booksController } from './books.controller';
jest.mock('../services/books.service');

describe('BooksController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = { params: {}, query: {} };
    mockRes = { status: jest.fn(), send: jest.fn() };
  
    mockRes.status.mockReturnValue(mockRes);
  });

  afterEach(() => {
    (booksService.getBookById as jest.Mock).mockReset();
  });
  
  describe('getBookById', () => {
    let id;

    beforeEach(() => {
      id = '6169b0511aa28622af3ab77d';
      mockReq.params = { id };
    });

    it('should make a call to the service to get the book, passing the id', () => {
      booksController.getBookById(mockReq, mockRes);

      expect(booksService.getBookById).toHaveBeenCalledWith(id, false);
    });

    it('should respond 200 status with the returned book', async() => {
      const book = {id: '6169b0511aa28622af3ab77d', title: 'War and Peace'};
      (booksService.getBookById as jest.Mock).mockResolvedValue(book);
      
      await booksController.getBookById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(book);
    });

    it('should retrieve the ratings if the ratings query param is set to true', () => {
      mockReq.query = { ratings: 'true'}

      booksController.getBookById(mockReq, mockRes);

      expect(booksService.getBookById).toHaveBeenCalledWith(id, true);
    });
  });

  describe('getBooksByParams', () => {
    it('should call to the service with the params', () => {
      mockReq.query = {author: 'Twain, Mark', year_written: '1859'};

      booksController.getBooksByParams(mockReq, mockRes);

      expect(booksService.getBooksByParams).toHaveBeenCalledWith({author: 'Twain, Mark', year_written: '1859'});
    });

    it('should not call with any unexpected params', () => {
      mockReq.query = {author: 'Twain, Mark', year_written: '1859', setBooks: 'I shouldn\'t be here!'};

      booksController.getBooksByParams(mockReq, mockRes);

      expect(booksService.getBooksByParams).toHaveBeenCalledWith({author: 'Twain, Mark', year_written: '1859'});
    });

    it('should call with fewer params if in the request', () => {
      mockReq.query = {author: 'Twain, Mark'};

      booksController.getBooksByParams(mockReq, mockRes);

      expect(booksService.getBooksByParams).toHaveBeenCalledWith({author: 'Twain, Mark'});
    });

    it('should send 200 status with the response from the service', async () => {
      const book = {id: '6169b0511aa28622af3ab77d', title: 'War and Peace'};
      (booksService.getBooksByParams as jest.Mock).mockResolvedValue([book]);
      mockReq.query = {author: 'Twain, Mark'};
      
      await booksController.getBooksByParams(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith([book]);
    });
  });
});