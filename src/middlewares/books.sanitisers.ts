import {query} from 'express-validator';
import { validate } from './validate';

export const sanitiseBooksQueryParams = () => [
  query('year_written').optional().isInt().toInt(),
  validate
]