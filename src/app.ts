import express from "express";
import { exceptionHandler } from "./middlewares/exception-handler/exception-handler";
import { bookRoutes } from "./routes/books.route";
import morgan from 'morgan';

export const app = express();

app.use(express.json());

app.use(morgan('[:date{clf]] Started :method :url HTTP/:http-version', { immediate: true }));
app.use(morgan('[:date{clf]] Completed :method :url with status :status in :response-time ms'));

app.use('/books', bookRoutes);

app.use(exceptionHandler);

