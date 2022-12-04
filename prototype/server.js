const express = require("express");

const app = express();
const PORT = 8085;

app.use(express.json());
app.listen(PORT, () => {
console.log(`Server running on ${PORT}`);
});
