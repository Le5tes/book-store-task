import request from 'supertest';
import { app } from '../app';
import books from '../../resources/books.json';
import ratings from '../../resources/ratings.json';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient

const standardisedRatings = ratings.map(rating => ({...rating, comment: rating.comment || null}));
const standardisedBooks = books.map(book => ({...book, price: book.price.toFixed(2)}));
const getRatingsforBookId = (id) => standardisedRatings.filter((rating) => rating.bookId === id);
const standardisedBooksWithRatings = standardisedBooks.map((book) => ({...book, ratings: getRatingsforBookId(book.id)}));

describe('/books', () => {
  let server;

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
});