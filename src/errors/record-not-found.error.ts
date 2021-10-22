export class RecordNotFoundError extends Error {
  cause;
  searchParams;
  constructor(options) {
    super(options.message)
    this.cause = options.cause;
    this.searchParams = options.searchParams;
  }
}