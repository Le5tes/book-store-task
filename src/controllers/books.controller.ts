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
}

export const booksController = new BooksController();