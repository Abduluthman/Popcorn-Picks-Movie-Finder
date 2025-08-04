# 🎬 Popcorn Picks Movie Finder

This is a web application to search, browse, and save your favorite movies. Built with Flask (Python), HTML/CSS, and JavaScript.

---

## 📝 Overview

**Movie Finder** helps users:

- Search movies using autocomplete
- View detailed movie information
- Filter results by genre
- Switch between light and dark modes
- Save favorites locally
- Track search history
- Navigate via pagination

---

## 📁 Project Structure
```bash
app.py # Flask backend logic
templates/
  index.html # Main HTML template
static/
  style.css # Styling
  script.js # JavaScript behavior
requirements.txt # Python packages
README.md # Project documentation
```
---

## 🚀 Features

### 🔍 Autocomplete Search

- Real-time suggestions as you type (min 2 characters)
- Powered by `/autocomplete` endpoint

### 🪄 Genre Filters

- Filter movie results using genre chips
- Chips update dynamically from search results

### 🌗 Light/Dark Mode

- Toggle button in the top-right corner
- Theme preference saved in `localStorage`

### ❤️ Favorites

- Add/remove movies from favorites
- Stored locally in `localStorage`
- View via a dedicated "Favorites" tab

### 📜 Search History

- Displays past search terms
- Clickable to repeat a search
- Option to clear history

### 🪟 Modal Movie Info

- Clicking a movie card opens a modal with:
  - Poster
  - Genre
  - Plot
  - Director
  - IMDb Rating

### 📄 Pagination

- Navigate through results using next/prev buttons

---

## ⚙️ Backend (`app.py`)

Flask routes:

- `/` — Homepage and search results
- `/autocomplete?q=` — Title suggestions for autocomplete
- `/movie/<imdb_id>` — Full movie info in JSON
- `/clear-history` — Clears search history cookie

---

## 🌐 Frontend

### `script.js`

Handles:

- Theme toggling
- Autocomplete logic
- Genre filtering
- Modal population
- Favorites management
- Tab switching (All / Favorites)

### `index.html`

- Jinja2 template rendered by Flask
- Injects search results and genre chips

### `style.css`

- Responsive layout
- Variables for light/dark theme
- Custom styles for movie cards, modals, badges, and more

---

## 📦 Local Storage Keys

| Key         | Purpose                        |
| ----------- | ------------------------------ |
| `theme`     | Stores the selected theme mode |
| `favorites` | Stores favorite movie data     |

---

## 🧪 Running the App

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the Flask server:
   ```bash
   python app.py
   ```
3. Open your browser:
   ```bash
   http://localhost:5000
   ```

## 📱 Test on Mobile

To test on your mobile device:

1. Ensure your phone and computer are on the same Wi-Fi network
2. Find your local IP address (e.g. 192.168.1.5)
3. Run Flask with:
   ```bash
   python app.py
   ```
4. Visit: http://192.168.1.5:5000 on your mobile browser

## 🔑 API Configuration

- Update the API key in app.py:
  ```bash
  API_KEY = ''
  ```
- Get your free key at: [OmdbApi](https://www.omdbapi.com/apikey.aspx)

## 🧠 Possible Future Enhancements

- 🔐 User login system
- 📺 Embed trailers from YouTube
- 📈 Popularity/rating-based sorting
- 🧭 Infinite scroll for smoother navigation
- 🗣️ Voice-based search

## 📄 License

MIT License. Feel free to use, modify, and share!

## 🧑‍💻 Author

Abdulwahab Uthman
For questions or collaboration: Abduluthman278@gmail.com
