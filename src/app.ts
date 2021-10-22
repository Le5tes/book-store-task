import express from "express";
import { exceptionHandler } from "./middlewares/exception-handler/excpetion-handler";
import { bookRoutes } from "./routes/books.route";

export const app = express();


app.use(express.json());

app.use('/books', bookRoutes);

app.use(exceptionHandler);

