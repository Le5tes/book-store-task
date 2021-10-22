import { Decimal } from '@prisma/client/runtime';
import {body, query} from 'express-validator';
import { validate } from './validate';

export const sanitiseBooksQueryParams = () => [
  query('year_written').optional().isInt().toInt(),
  validate
]

export const validateBookBody = () => [
  body('id').exists().isString(),
  body('title').exists().isString(),
  body('author').exists().isString(),
  body('year_written').exists().isInt().toInt(),
  body('edition').exists().isString(),
  priceValidator,
  validate
]

const priceValidator = body('price')
  .exists()
  .isNumeric()
  .isCurrency({digits_after_decimal:[1,2]})
  .bail()
  .customSanitizer(val => new Decimal(val))
