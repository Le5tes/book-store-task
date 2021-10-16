import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req,res) => {
    res.status(200).send('HELLO!');
})

app.listen(PORT, () => {
    console.log(`starting app on port: ${PORT}`);
});