const prisma = new (require('@prisma/client').PrismaClient)();
const fs = require('fs');

(async() => {
  const books = JSON.parse(fs.readFileSync('./resources/books.json'));
  const ratings = JSON.parse(fs.readFileSync('./resources/ratings.json'));
  console.log('loaded data from json files');
  await prisma.book.createMany({data: books});
  await prisma.rating.createMany({data: ratings});
  console.log('loaded data into db');
})();
