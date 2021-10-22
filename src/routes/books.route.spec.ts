import { Decimal } from '@prisma/client/runtime';
import request from 'supertest';
import { app } from '../app';
import { booksController } from '../controllers/books.controller';
jest.mock('../controllers/books.controller');

describe('/books', () => {
  let server: request.SuperTest<request.Test>;

  beforeEach(() => {
    server = request(app);
    (booksController.getBookById as jest.Mock).mockImplementation((req, res) => res.status(200).send());
    (booksController.getBooksByParams as jest.Mock).mockImplementation((req, res) => res.status(200).send());
    (booksController.createBook as jest.Mock).mockImplementation((req, res) => res.status(201).send());
    (booksController.updateBook as jest.Mock).mockImplementation((req, res) => res.status(200).send());
  });

  afterEach(() => {
    (booksController.getBookById as jest.Mock).mockReset();
    (booksController.getBooksByParams as jest.Mock).mockReset();
    (booksController.createBook as jest.Mock).mockReset();
    (booksController.updateBook as jest.Mock).mockReset();
  });

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

      const request = getRequest(booksController.getBooksByParams);

      expect(request.query.year_written).toEqual(1999);
    });

    it('should not call the controller and should return 400 if the year_written is not a number', async() => {
      const res = await server.get('/books?year_written=book');

      expect(booksController.getBooksByParams).not.toHaveBeenCalled();

      expect(res.status).toEqual(400);
    })
  });

  describe('POST', () => {
    let book;
    beforeEach(() => {
      book = {
        id: '6169b0511aa75687af3ab99a',
        title: 'Dune',
        author: 'Herbert, Frank',
        year_written: 1965,
        edition: 'Penguin',
        price: 12.7
      };
    });

    it('should call the controller when the book is valid', async() => {
      await server.post('/books').send(book);

      const req = getRequest(booksController.createBook);

      expect(booksController.createBook).toHaveBeenCalled();
      expect(req.body).toEqual({...book, price: new Decimal(book.price)});
    });

    it('should not call the controller and return 400 when the book is not valid', async() => {
      book.id = undefined;
      
      const res = await server.post('/books').send(book);
      
      expect(booksController.createBook).not.toHaveBeenCalled();
      expect(res.status).toEqual(400);
    });
  });

  describe('PUT', () => {
    let book;
    beforeEach(() => {
      book = {
        id: "6169b0511aa28622af3ab77d",
        title: "War and Peace",
        author: "Tolstoy, Leo",
        year_written: 1865,
        edition: "Penguin",
        price: 14
      };
    });

    it('should call the controller when the book is valid', async() => {
      await server.put('/books').send(book);

      const req = getRequest(booksController.updateBook);

      expect(booksController.updateBook).toHaveBeenCalled();
      expect(req.body).toEqual({...book, price: new Decimal(book.price)});
    });

    it('should not call the controller and return 400 when the book is not valid', async() => {
      book.id = undefined;
      
      const res = await server.put('/books').send(book);
      
      expect(booksController.updateBook).not.toHaveBeenCalled();
      expect(res.status).toEqual(400);
    });
  });

  const getRequest = (mock) => {
    return mock.mock.calls[0][0]
  }
});
