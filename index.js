import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Startseite
app.get("/", (req, res) => {
  const username = req.cookies.username;
  if (username) {
    res.send(`
      <h1>Willkommen zurück, ${username}!</h1>
      <a href="/logout">Logout</a>
    `);
  } else {
    res.send(`
      <h1>Hallo Gast!</h1>
      <form method="POST" action="/login">
        <input type="text" name="username" placeholder="Dein Name" required />
        <button type="submit">Login</button>
      </form>
    `);
  }
});

// Login – Cookie setzen
app.post("/login", (req, res) => {
  const { username } = req.body;
  res.cookie("username", username, { httpOnly: true, maxAge: 60000 });
  res.redirect("/");
});

// Logout – Cookie löschen
app.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/");
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
