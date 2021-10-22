import {default as request} from 'supertest';
import { app } from '../app';
import books from '../../resources/books.json';
import ratings from '../../resources/ratings.json';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

const prisma = new PrismaClient

const standardisedRatings = ratings.map(rating => ({...rating, comment: rating.comment || null}));
const standardisedBooks = books.map(book => ({...book, price: book.price.toFixed(2)}));
const getRatingsforBookId = (id) => standardisedRatings.filter((rating) => rating.bookId === id);
const standardisedBooksWithRatings = standardisedBooks.map((book) => ({...book, ratings: getRatingsforBookId(book.id)}));

describe('/books', () => {
  let server: request.SuperTest<request.Test>;

  beforeEach(async () => {
    server = request(app);
    await prisma.book.createMany({data: books})
    await prisma.rating.createMany({data: ratings})
  });

  afterEach(async() => {
    await prisma.rating.deleteMany({}); // Delete all
    await prisma.book.deleteMany({}); // Delete all
  });

  describe('GET by id', () => {
    it('should return a book by id', async () => {
      const res = await server.get('/books/6169b0511aa28622af3ab77d');

      expect(res.status).toEqual(200);
      expect(res.body).toEqual(standardisedBooks[1]);
    });

    it('should returmn the ratings with the book when ratings query param is set to true', async () => {
      const res = await server.get('/books/6169b0511aa28622af3ab77d?ratings=true');

      expect(res.status).toEqual(200);
      expect(res.body).toEqual(standardisedBooksWithRatings[1]);
    });

    it('should return 404 if ther id is not found', async() => {
      const res = await server.get('/books/45');

      expect(res.status).toEqual(404);
    });
  });

  describe('GET with params', () => {
    it('it should return the books by author', async () => {
      const res = await server.get('/books?author=Twain,+Mark');

      expect(res.status).toEqual(200);
      expect(res.body).toEqual([standardisedBooks[5], standardisedBooks[7]]);
    });

    it('it should return the books by year', async () => {
      const res = await server.get('/books?year_written=1937');

      expect(res.status).toEqual(200);
      expect(res.body).toEqual([standardisedBooks[12]]);
    });

    it('should return 400 if the year is not a number', async() => {
      const res = await server.get('/books?year_written=book');

      expect(res.status).toEqual(400);
    });
  });

  describe('POST', () => {
    const book = {
      id: "6169b0511aa75687af3ab99a",
      title: "Dune",
      author: "Herbert, Frank",
      year_written: 1865,
      edition: "Penguin",
      price: 12.7
    };

    it('should return 201 status when a book is successfully added', async() => {
      const res = await server.post('/books').send(book);

      expect(res.status).toEqual(201);
    });

    it('should store the book in the db', async() => {
      await server.post('/books').send(book);

      const storedBook = await prisma.book.findUnique({where: {id: book.id}});
      
      expect(storedBook).toEqual({...book, price: new Decimal(book.price)});
    });

    it('should return 400 status when the body is malformed', async() => {
      const res = await server.post('/books').send({boooooook: '!!!'});

      expect(res.status).toEqual(400);
    });
  });

  describe('PUT', () => {
    const book = {
      id: "6169b0511aa28622af3ab77d",
      title: "War and Peace",
      author: "Tolstoy, Leo",
      year_written: 1865,
      edition: "Penguin",
      price: 14
    };

    it('should return 200 status when a book is successfully added', async() => {
      const res = await server.put('/books').send(book);

      expect(res.status).toEqual(200);
    });

    it('should store the book in the db', async() => {
      await server.put('/books').send(book);

      const storedBook = await prisma.book.findUnique({where: {id: book.id}});
      
      expect(storedBook).toEqual({...book, price: new Decimal(book.price)});
    });

    it('should return 400 status when the body is malformed', async() => {
      const res = await server.put('/books').send({boooooook: '!!!'});

      expect(res.status).toEqual(400);
    });

    it('should return 404 when the book to be updated doesn\'t exist (by id)', async() => {
      const res = await server.put('/books').send({...book, id: '6169b0511aa75687af3ab99a'});

      expect(res.status).toEqual(404);
    });
  });
});