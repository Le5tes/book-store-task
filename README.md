# book-store-task
A REST-API for a book store in express

## Prerequisites
This project uses postgres as a data source. For testing in dev set up a postgres database and ensure it accessible via local host. 
By default the project attempts to authenticarte using the user 'postgres' and password 'Dev'. These can be changed in the .env file.
In production setup the database connection should be set in the DATABASE_URL environment variable;
The project expects a database named bookstore to be available to this user.

For more info on setting up postgres see [Getting Started with Postgres](https://www.postgresqltutorial.com/postgresql-getting-started/)

## Setup
- Clone this repository:
``` $ git clone git@github.com:Le5tes/book-store-task.git ```
- Ensure you have node and npm installed:
    - MAC-OS: 
``` $ brew install npm ```
    - Linux: 
``` $ sudo apt install npm ```

- Install dependencies: 
``` $ npm install ```

- Apply database schema
```npx prisma db push```

- (Optional) Preload the database from initial source 
```npm run load-database```
(See data in the resources folder)

- To run tests
```npm test```

- To start server
```npm start```

## Endpoints
### GET /books/:id
Retrieve a book by id

Optionally the ratings query string parameter can be passed (true or false), which will mean that ratings 
for the book are also returned

### GET /books?
Retrieve books by query string
#### Parameters
- author
- year_written

### POST /books
Add a new book entry
#### Properties
- id
- title
- author
- year_written
- edition
- price
(all properties are required)

### PUT /books
Update an existing book entry
#### Properties
- id
- title
- author
- year_written
- edition
- price
(all properties are required)