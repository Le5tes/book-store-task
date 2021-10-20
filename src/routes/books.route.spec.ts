import request from 'supertest';
import { app } from '../app';
import { booksController } from '../controllers/books.controller';
jest.mock('../controllers/books.controller');

describe('/books', () => {
  let server;

  beforeEach(() => {
    server = request(app);
    (booksController.getBookById as jest.Mock).mockImplementation((req, res) => res.status(200).send());
  });

  describe('GET', () => {
    it('should make a call to the books controller', async() => {
      await server.get('/books/6169b0511aa28622af3ab77d')

      expect(booksController.getBookById).toHaveBeenCalled();
    });

  });
});
