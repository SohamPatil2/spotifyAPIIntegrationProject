import express from "express";
import axios from "axios";
import { fileURLToPath } from "url";
import path from "path";

var loggedIn = false;
const port = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended : true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("login", {loggedIn : loggedIn});
})

app.post("/login", (req, res) => {
    if(req.body.email == "abc@gmail.com" && req.body.password == "123") res.render("mainpage");
    else res.render("login");
})

app.listen(port, (error) => {
    if(error) console.log("Error on starting Server.", error.message);
    else console.log(`Server listening on port ${port}`);
})