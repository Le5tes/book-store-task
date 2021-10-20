import express from "express";
import { bookRoutes } from "./routes/books.route";

export const app = express();
const PORT = process.env.PORT || 8080;

app.use('/books', bookRoutes);

app.get('/', (req,res) => {
    res.status(200).send('HELLO!');
});


// app.listen(PORT, () => {
//     console.log(`starting app on port: ${PORT}`);
// });
