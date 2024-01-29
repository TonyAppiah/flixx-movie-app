const global = {
  currentPage: window.location.pathname,
};

// highlight active nav link
const navLinks = document.querySelectorAll(".nav-link");

function highlight_Active_Nav_Link() {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }

    // using a ternary operator
    // link.getAttribute("href") === global.currentPage
    //   ? link.classList.add("active")
    //   : null;
  });
}

// fetch data from API function
async function fetchAPIData(endpoint) {
  const API_URL = "https://api.themoviedb.org/3/";

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMWI3MGZmZGRmNDQwZjE3MjZlMTgxZTIzODNiZDllMyIsInN1YiI6IjY1YjQwMTEwMGVkMmFiMDE4NDg2YWI4NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gmF70aS9fTRS0M5GsTOio7fMaudH6j-sz8udrcJ-tTU",
    },
  };

  document.querySelector(".spinner").classList.add("show");

  const response = await fetch(`${API_URL}${endpoint}?language=en-US`, options);
  const data = await response.json();

  document.querySelector(".spinner").classList.remove("show");

  return data;
}

// display popupar movies function
async function display_Popular_Movies() {
  const response = await fetchAPIData("movie/popular");
  response.results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<a href="movie-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
                : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>`;
    document.querySelector("#popular-movies").appendChild(div);
  });
}

// display movie details
async function display_Movie_Details() {
  const movieId = window.location.search.split("=")[1];

  const movie = await fetchAPIData(`movie/${movieId}`);

  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
          <div>
            ${
              movie.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
                : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">              
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${numberWithCommas(
              movie.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> $${movie.revenue.toLocaleString()}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies
            .map((company) => company.name)
            .join(", ")}</div>
        </div>`;
  document.querySelector("#movie-details").appendChild(div);
}

//  display popular tv shows function
async function display_Popular_TvShows() {
  const response = await fetchAPIData("tv/popular");
  response.results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<a href="tv-details.html?id=${show.id}">
               ${
                 show.poster_path
                   ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
                   : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
               }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${show.first_air_date}</small>
            </p>
          </div>`;
    document.querySelector("#popular-shows").appendChild(div);
  });
}

// add commas to a number - alternative is to use .toLocaleStrig() on the number
function numberWithCommas(number) {
  return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// init function
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      display_Popular_Movies();
      break;
    case "/movie-details.html":
      display_Movie_Details();
      break;
    case "/shows.html":
      display_Popular_TvShows();
      break;
    case "/tv-details.html":
      console.log("TV DETAILS");
      break;
    case "/search.html":
      console.log("SEARCH");
      break;

    default:
      break;
  }

  highlight_Active_Nav_Link();
}

document.addEventListener("DOMContentLoaded", init);
