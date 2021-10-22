import { validationResult } from 'express-validator';
import { ValidationError } from '../../errors/validation.error';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  throw new ValidationError(errors.mapped());
}