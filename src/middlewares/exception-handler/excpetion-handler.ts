import { RecordNotFoundError } from "../../errors/record-not-found.error"
import { ValidationError } from "../../errors/validation.error";

export const exceptionHandler = (err,req,res,next) => {
  let status;

  if (err instanceof RecordNotFoundError) {
    status = 404;
  } else if (err instanceof ValidationError) {
    status = 400;
  } else {
    status = 500;
  }

  res.status(status).send();
}
