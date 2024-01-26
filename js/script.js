const global = {
  currentPage: window.location.pathname,
};

// highlight active nav link
const navLinks = document.querySelectorAll(".nav-link");

function highlight_Active_Nav_Link() {
  navLinks.forEach((link) => {
    // if (link.getAttribute("href") === global.currentPage) {
    //   link.classList.add("active");
    // }

    // using a ternary operator
    link.getAttribute("href") === global.currentPage
      ? link.classList.add("active")
      : null;
  });
}

// init function
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      console.log("HOME");
      break;
    case "/movie-details.html":
      console.log("MOVIE DETAILS");
      break;
    case "/shows.html":
      console.log("TV SHOWS");
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
