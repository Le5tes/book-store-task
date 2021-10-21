import request from 'supertest';
import { app } from '../app';
import { booksController } from '../controllers/books.controller';
jest.mock('../controllers/books.controller');

describe('/books', () => {
  let server;

  beforeEach(() => {
    server = request(app);
    (booksController.getBookById as jest.Mock).mockImplementation((req, res) => res.status(200).send());
    (booksController.getBooksByParams as jest.Mock).mockImplementation((req, res) => res.status(200).send());
  });

  afterEach(() => {
    (booksController.getBookById as jest.Mock).mockReset();
    (booksController.getBooksByParams as jest.Mock).mockReset();
  })

  describe('GET by id', () => {
    it('should make a call to the books controller', async() => {
      await server.get('/books/6169b0511aa28622af3ab77d')

      expect(booksController.getBookById).toHaveBeenCalled();
    });
  });

  describe('GET by params', () => {
    it('should make a call to the books controller', async() => {
      await server.get('/books?author=Twain,+Mark');

      expect(booksController.getBooksByParams).toHaveBeenCalled();
    });

    it('should convert year to a number', async() => {
      await server.get('/books?year_written=1999');

      const request = (booksController.getBooksByParams as jest.Mock).mock.calls[0][0];

      expect(request.query.year_written).toEqual(1999);
    });
  });
});
