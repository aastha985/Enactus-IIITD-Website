const express = require("express");
const app = express();

const indexRoutes = require("./routes/index");

app.set("view engine", "ejs");

app.use(indexRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});
