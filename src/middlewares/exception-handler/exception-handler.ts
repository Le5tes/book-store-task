import { RecordNotFoundError } from "../../errors/record-not-found.error"
import { ValidationError } from "../../errors/validation.error";

export const exceptionHandler = (err,req,res,next) => {
  let status;
  let message;

  if (err instanceof RecordNotFoundError) {
    status = 404;
    message = `No records found matching ${JSON.stringify(err.searchParams)}`
  } else if (err instanceof ValidationError) {
    status = 400;
    message = `Request validation failed: ${JSON.stringify(err.errors)}`;
  } else {
    status = 500;
    message = 'Something went wrong! Please try again later.'
    console.error(err);
  }

  res.status(status).send(message);
}
