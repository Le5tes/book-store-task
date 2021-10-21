import { validationResult } from 'express-validator';
import { validate } from './validate';
jest.mock('express-validator');

describe('validate', () => {
  let next;
  let errorsMock;

  beforeEach(() => {
    next = jest.fn();
    errorsMock = {
      isEmpty: jest.fn(),
      mapped: jest.fn()
    };
    (validationResult as any as jest.Mock).mockReturnValue(errorsMock);

  });
  
  it('should call the next function if no validation errors', () => {
    errorsMock.isEmpty.mockReturnValue(true);

    validate({}, {}, next);
   
    expect(next).toHaveBeenCalled();
  });

  it('should throw a 400 error if validation failures', () => {
    errorsMock.isEmpty.mockReturnValue(false);

    expect(() => validate({}, {}, next)).toThrow();
  });
});
