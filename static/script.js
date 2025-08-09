document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector('input[name="movie"]');
  const list = document.getElementById("autocomplete-list");
  const spinner = document.getElementById("spinner");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const themeBtn = document.getElementById("theme-toggle");
  const allMoviesSection = document.getElementById("all-movies");
  const favoritesSection = document.getElementById("favorites");
  const favTabBtn = document.getElementById("show-favorites-tab");
  const allTabBtn = document.getElementById("show-all-tab");
  const genreChips = document.querySelectorAll(".genre-chip");
  const movieCards = document.querySelectorAll(".movie-card");

  /* === Theme Toggle === */
  const setTheme = (theme) => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeBtn) {
      themeBtn.textContent = theme === "dark" ? "🌞 Light" : "🌙 Dark";
    }
  };

  setTheme(localStorage.getItem("theme") || "light");

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.body.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* === Autocomplete === */
  input?.addEventListener("input", async () => {
    const query = input.value.trim();
    if (query.length < 2) {
      list.innerHTML = "";
      return;
    }

    try {
      const res = await fetch(`/autocomplete?q=${query}`);
      const data = await res.json();
      list.innerHTML = "";
      data.forEach((title) => {
        const li = document.createElement("li");
        li.textContent = title;
        li.addEventListener("click", () => {
          input.value = title;
          list.innerHTML = "";
        });
        list.appendChild(li);
      });
    } catch (err) {
      console.error("Autocomplete error:", err);
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target !== input) list.innerHTML = "";
  });

  /* === Modal Handling === */
  const showModal = async (imdbID) => {
    modalBody.innerHTML = "Loading...";
    modal.style.display = "block";
    spinner.style.display = "block";

    try {
      const res = await fetch(`/movie/${imdbID}`);
      const movie = await res.json();

      modalBody.innerHTML = `
        <h2>${movie.Title} (${movie.Year})</h2>
        <img src="${movie.Poster}" style="width:100%; max-height:300px; object-fit:contain;">
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <p><strong>IMDb:</strong> ${movie.imdbRating}</p>
      `;
    } catch (err) {
      modalBody.innerHTML = `<p>Failed to load movie details. Please try again.</p>`;
    } finally {
      spinner.style.display = "none";
    }
  };

  window.closeModal = () => {
    modal.style.display = "none";
  };

  /* === Genre Filters === */
  genreChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const selected = chip.dataset.genre;

      genreChips.forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");

      movieCards.forEach((card) => {
        const tags = Array.from(card.querySelectorAll(".genre-tag")).map(
          (tag) => tag.textContent.trim()
        );
        card.style.display =
          selected === "All" || tags.includes(selected) ? "block" : "none";
      });
    });
  });

  /* === Modal Binding for Movie Cards === */
  movieCards.forEach((card) => {
    card.addEventListener("click", async () => {
      const imdbID = card.getAttribute("data-id");
      if (imdbID) await showModal(imdbID);
    });
  });

  /* === Favorites Logic === */
  const getFavorites = () =>
    JSON.parse(localStorage.getItem("favorites") || "[]");

  const saveFavorites = (favs) =>
    localStorage.setItem("favorites", JSON.stringify(favs));

  const isFavorite = (id) => getFavorites().some((f) => f.id === id);

  const toggleFavorite = (movie) => {
    let favs = getFavorites();
    const exists = favs.some((f) => f.id === movie.id);

    if (exists) {
      favs = favs.filter((f) => f.id !== movie.id);
    } else {
      favs.push(movie);
    }

    saveFavorites(favs);
    renderFavorites();
  };

  const renderFavorites = () => {
    const favs = getFavorites();
    favoritesSection.innerHTML = "";

    if (favs.length === 0) {
      favoritesSection.innerHTML = "<p>No favorites added yet.</p>";
      return;
    }

    favs.forEach((movie) => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.setAttribute("data-id", movie.id);

      card.innerHTML = `
        <img src="${movie.poster}" alt="Poster for ${movie.title}">
        <h3>${movie.title}</h3>
        <button class="fav-btn active">❤️ Favorited</button>
      `;

      card.querySelector(".fav-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(movie);
      });

      card.addEventListener("click", () => showModal(movie.id));
      favoritesSection.appendChild(card);
    });
  };

  /* === Bind favorite buttons on all movie cards === */
  document.querySelectorAll(".fav-btn").forEach((btn) => {
    const movie = {
      id: btn.dataset.id,
      title: btn.dataset.title,
      poster: btn.dataset.poster,
    };

    if (isFavorite(movie.id)) {
      btn.classList.add("active");
      btn.textContent = "❤️ Favorited";
      btn.style.backgroundColor = "#c62828";
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      btn.classList.toggle("active");

      const isActive = btn.classList.contains("active");
      btn.textContent = isActive ? "❤️ Favorited" : "Add to Favorites";
      btn.style.backgroundColor = isActive ? "#c62828" : "#f44336";

      toggleFavorite(movie);
    });
  });

  /* === Tab Switching === */
  if (favTabBtn && allTabBtn) {
    favTabBtn.addEventListener("click", () => {
      allMoviesSection.style.display = "none";
      favoritesSection.style.display = "flex";
      favTabBtn.classList.add("active");
      allTabBtn.classList.remove("active");
      renderFavorites();
    });

    allTabBtn.addEventListener("click", () => {
      allMoviesSection.style.display = "flex";
      favoritesSection.style.display = "none";
      allTabBtn.classList.add("active");
      favTabBtn.classList.remove("active");
    });
  }

  /* === Initial favorites load === */
  renderFavorites();
});
