export class ValidationError extends Error {
  errors;
  constructor(errors) {
    super()
    this.errors = errors;
  }
}