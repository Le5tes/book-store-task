import { booksService } from "../services/books.service";

class BooksController {
  async getBookById(req, res) {
    const id = req.params.id;
    const ratings = req.query.ratings === 'true';

    res.status(200).send(await booksService.getBookById(id, ratings));
  }
}


export const booksController = new BooksController();