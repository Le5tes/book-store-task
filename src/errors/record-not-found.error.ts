export class RecordNotFoundError extends Error {
  constructor(options) {
    super(options.message)
  }
}