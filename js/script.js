const global = {
  currentPage: window.location.pathname,
  search: {
    type: "",
    term: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
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

// display slider function
async function slider() {
  const { results } = await fetchAPIData("movie/now_playing");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `<a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${
                movie.poster_path
              }" alt="Movie Title" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
                1
              )} / 10
            </h4>`;

    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
}

// initialise swiper function
function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 50,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
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

  display_Page_Backdrop("movie", movie.backdrop_path);

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

//  display tv show details
async function display_TvShow_Details() {
  const showId = window.location.search.split("=")[1];

  const show = await fetchAPIData(`tv/${showId}`);

  display_Page_Backdrop("show", show.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
          <div>
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
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Air Date: ${show.first_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">              
              ${show.genres.map((genre) => `<li>${genre.name}<li/>`).join("")}
            </ul>
            <a href="${
              show.homepage
            }" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              show.number_of_episodes
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                show.last_episode_to_air.name
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies
            .map((company) => company.name)
            .join(", ")}</div>
        </div>`;

  document.querySelector("#show-details").appendChild(div);
}

// search movie/shows function and display them in DOM
async function search() {
  const queryString = window.location.search;
  global.search.type = new URLSearchParams(queryString).get("type");
  global.search.term = new URLSearchParams(queryString).get("search-term");

  // validating an empty search field
  if (global.search.term !== "" && global.search.term !== null) {
    const response = await searchAPIData();

    // checking for 0 results
    if (response.results.length === 0) {
      showAlert("No results found");
      return;
    }

    global.search.page = response.page;
    global.search.totalPages = response.total_pages;
    global.search.totalResults = response.total_results;

    document.querySelector("#search-results-heading").innerHTML = `
      <h2>1 - ${response.results.length} of ${global.search.totalResults} Results showing for ${global.search.term}</h2>
    `;

    displaySearchResults(response.results);
  } else {
    showAlert("Please enter search term");
  }
}

async function searchAPIData() {
  const API_URL = "https://api.themoviedb.org/3/search/";

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMWI3MGZmZGRmNDQwZjE3MjZlMTgxZTIzODNiZDllMyIsInN1YiI6IjY1YjQwMTEwMGVkMmFiMDE4NDg2YWI4NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gmF70aS9fTRS0M5GsTOio7fMaudH6j-sz8udrcJ-tTU",
    },
  };

  document.querySelector(".spinner").classList.add("show");

  const response = await fetch(
    `${API_URL}${global.search.type}?language=en-US&query=${global.search.term}&page=${global.search.page}`,
    options
  );
  const data = await response.json();

  document.querySelector(".spinner").classList.remove("show");

  return data;
}

// DISPLAY SEARCH RESULTS FUNCTION

function displaySearchResults(results) {
  document.querySelector("#search-results").innerHTML = "";
  // document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<a href="${global.search.type}-details.html?id=${
      result.id
    }">
            ${
              result.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${
                global.search.type === "movie" ? result.title : result.name
              }"
            />`
                : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${
                global.search.type === "movie" ? result.title : result.name
              }"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === "movie" ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                global.search.type === "movie"
                  ? result.release_date
                  : result.first_air_date
              }</small>
            </p>
          </div>`;
    document.querySelector("#search-results").appendChild(div);
  });

  displayPagination();
}

// display pagination function
function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;

  document.querySelector("#pagination").appendChild(div);

  // disabling prev & next buttons when on first and last pages respectively
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  } else if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  // upon clicking on next button
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results } = await searchAPIData();

    displaySearchResults(results);
  });

  // upon clicking on prev button
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });
}

// custom alert box display function
function showAlert(message, className) {
  const alertDiv = document.createElement("div");
  alertDiv.classList.add("alert", className);
  alertDiv.appendChild(document.createTextNode(message));

  document.querySelector("#alert").appendChild(alertDiv);

  setTimeout(() => alertDiv.remove(), 3000);
}

// add commas to a number - alternative is to use .toLocaleStrig() on the number
function numberWithCommas(number) {
  return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// display details page backfrop image function
function display_Page_Backdrop(type, backdropPath) {
  const backdropDiv = document.createElement("div");
  backdropDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdropPath})`;
  backdropDiv.style.backgroundPosition = "center";
  backdropDiv.style.backgroundRepeat = "no-repeat";
  backdropDiv.style.height = "100vh";
  backdropDiv.style.width = "100vw";
  // backdropDiv.style.position = "absolute";
  backdropDiv.style.position = "fixed";
  backdropDiv.style.top = "0";
  backdropDiv.style.left = "0";
  backdropDiv.style.zIndex = "-1";
  backdropDiv.style.opacity = "0.15";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(backdropDiv);
  } else {
    document.querySelector("#show-details").appendChild(backdropDiv);
  }
}

// init function
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      slider();
      display_Popular_Movies();
      break;
    case "/movie-details.html":
      display_Movie_Details();
      break;
    case "/shows.html":
      display_Popular_TvShows();
      break;
    case "/tv-details.html":
      display_TvShow_Details();
      break;
    case "/search.html":
      search();
      break;

    default:
      break;
  }

  highlight_Active_Nav_Link();
}

document.addEventListener("DOMContentLoaded", init);
