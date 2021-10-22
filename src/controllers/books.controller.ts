import { booksService } from "../services/books.service";

class BooksController {
  async getBookById(req, res) {
    const id = req.params.id;
    const ratings = req.query.ratings === 'true';

    res.status(200).send(await booksService.getBookById(id, ratings));
  }

  async getBooksByParams(req, res) {
    const {author, year_written} = req.query;
    const queryParams = {author, year_written};

    res.status(200).send(await booksService.getBooksByParams(queryParams));
  }

  async createBook(req,res) {
    const {id, title, author, year_written, edition, price} = req.body;

    await booksService.createBook({id, title, author, year_written, edition, price});

    res.status(201).send();
  }

  async updateBook(req,res) {
    const {id, title, author, year_written, edition, price} = req.body;

    await booksService.updateBook({id, title, author, year_written, edition, price});

    res.status(200).send();
  }
}

export const booksController = new BooksController();