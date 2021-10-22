import { Decimal } from "@prisma/client/runtime";
import { sanitiseBooksQueryParams, validateBookBody } from "./books.validators";

const runValidations = async (validators: ((res,req,next)=>void)[], req) => {
  const [res, next] = [{}, jest.fn()];

  return await validators.reduce(async (promise, validator) => {
    await promise;
    return validator(req,res,next);
  }, Promise.resolve()).then((res) => true, (rej) => false);
}

describe('sanitiseBooksQueryParams', () => {
  it('should pass if is empty query params', async() => {
    const mockReq = {query: {}};

    const valid = await runValidations(sanitiseBooksQueryParams(), mockReq);

    expect(valid).toEqual(true);
  });

  it('should pass if the year_written query param is a valid number', async() => {
    const mockReq = {query: {year_written: '1990'}};

    const valid = await runValidations(sanitiseBooksQueryParams(), mockReq);

    expect(valid).toEqual(true);
  });

  it('should fail if the year_written query param is not a valid number', async() => {
    const mockReq = {query: {year_written: 'book'}};

    const valid = await runValidations(sanitiseBooksQueryParams(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should convert the year_written query param to a number', async() => {
    const mockReq = {query: {year_written: '1990'}};

    await runValidations(sanitiseBooksQueryParams(), mockReq);

    expect(mockReq.query.year_written).toEqual(1990);
  });
});

describe('validateBookBody', () => {
  let book;
  let mockReq;

  beforeEach(() => {
    book = {
      id: "6169b0511aa75687af3ab99a",
      title: "Dune",
      author: "Herbert, Frank",
      year_written: 1865,
      edition: "Penguin",
      price: 12.7
    };
    mockReq = {body: book};
  });

  it('should pass when the book is valid', async() => {
    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(true);
  });

  it('should fail when the id is missing', async() => {
    book.id = undefined;

    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should fail when the id is not a valid string', async() => {
    book.id = 123;
    
    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should fail when the title is missing', async() => {
    book.title = undefined;

    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should fail when the title is not a valid string', async() => {
    book.title = 123;
    
    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should fail when the author is missing', async() => {
    book.author = undefined;

    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should fail when the author is not a valid string', async() => {
    book.author = 123;
    
    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should fail when the year_written is missing', async() => {
    book.year_written = undefined;

    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should fail when the year_written is not a valid number', async() => {
    book.year_written = 'book';
    
    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should ensure the year_written is a number', async() => {
    book.year_written = '1990';
    
    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(true);
    expect(book.year_written).toEqual(1990);
  });

  it('should fail when the year_written is not an integer', async() => {
    book.year_written = 1990.9;
    
    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should fail when the edition is missing', async() => {
    book.edition = undefined;

    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should fail when the edition is not a valid string', async() => {
    book.edition = 123;
    
    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should fail when the price is missing', async() => {
    book.price = undefined;

    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should fail when the price is not a valid number', async() => {
    book.price = 'book';
    
    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should fail when the price is to more than 2dp', async() => {
    book.price = 21.999;
    
    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(false);
  });

  it('should ensure the price is a valid Decimal', async() => {
    book.price = '21.99';
    
    const valid = await runValidations(validateBookBody(), mockReq);

    expect(valid).toEqual(true);
    expect(book.price).toEqual(new Decimal(21.99));
  });
});