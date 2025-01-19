// Fetch the structure of articles from index.json
fetch("index.json")
  .then((response) => response.json())
  .then((data) => {
    window.articlesData = data;
    renderNavigation(data); // Render the navigation buttons
    displayIntro(); // Show the introductory content initially
  });

// Render the navigation based on the JSON data
function renderNavigation(data) {
  const nav = document.getElementById("navigation");
  nav.innerHTML = ""; // Clear existing content

  let itemsShown = 0;

  // Create a list for the sections
  const sectionsList = document.createElement("ul");

  // Render the sections
  data.forEach((section) => {
    if (itemsShown >= 21) return; // Stop rendering if we've reached 21 items

    // Create a section button
    const sectionLink = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = section.section;
    button.onclick = () => {
      displayArticles(section); // Display articles from the clicked section
    };
    sectionLink.appendChild(button);
    sectionsList.appendChild(sectionLink);
    itemsShown++;
  });

  // Append the sections to the sidebar
  nav.appendChild(sectionsList);

  // Create a divider for the sections and articles
  const divider = document.createElement("hr");
  nav.appendChild(divider);

  // Create a list for the articles
  const articlesList = document.createElement("ul");

  // Render articles, limited to the total number of visible items
  data.forEach((section) => {
    if (itemsShown >= 21) return; // Stop rendering if we've reached 21 items

    section.articles.forEach((article) => {
      if (itemsShown >= 21) return; // Stop rendering if we've reached 21 items

      const articleLink = document.createElement("li");
      const articleButton = document.createElement("button");
      articleButton.textContent = article.title;
      articleButton.onclick = () => {
        loadMarkdown(article.file); // Load the full article when clicked
      };
      articleLink.appendChild(articleButton);
      articlesList.appendChild(articleLink);
      itemsShown++;
    });
  });

  // Append the articles list to the sidebar
  nav.appendChild(articlesList);
}

// Show articles from a selected section
function displayArticles(section) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = ""; // Clear previous content

  section.articles.forEach((article) => {
    const articleDiv = document.createElement("div");
    articleDiv.classList.add("article-preview");

    const button = document.createElement("button");
    button.textContent = article.title;
    button.onclick = () => {
      loadMarkdown(article.file); // Load the full article when clicked
    };

    articleDiv.appendChild(button);
    contentDiv.appendChild(articleDiv);
  });
}

// Search functionality: Filters both sections and articles
function searchSections() {
  const query = document.getElementById("search").value.toLowerCase();

  const filteredSections = window.articlesData
    .map((section) => {
      // Filter articles based on the search query (case-insensitive)
      const filteredArticles = section.articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          section.section.toLowerCase().includes(query)
      );

      // Check if the section name or any article matches the search query
      if (
        section.section.toLowerCase().includes(query) ||
        filteredArticles.length > 0
      ) {
        return {
          section: section.section,
          articles: filteredArticles,
        };
      }
      return null; // Return null if nothing matches
    })
    .filter((section) => section !== null); // Remove any sections with no matches

  // Re-render the navigation based on filtered sections
  renderNavigation(filteredSections);
}

// Event listener for search input to filter sections and articles
document.getElementById("search").addEventListener("input", searchSections);

function displayIntro() {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = `
    <h1>InvestoByte</h1>
    <p>Welcome to InvestoByte! Explore a variety of articles on different topics like Cats, Computer Science, and more. 
    Use the search bar to find your preferred section, then browse the articles within it.</p>
    <p>Start exploring by searching or selecting a section from the sidebar.</p>
  `;
}

// Function to load Markdown files and convert them to HTML using Showdown.js
function loadMarkdown(file) {
  fetch('content/' + file)
    .then((response) => response.text())
    .then((mdContent) => {
      const converter = new showdown.Converter();
      const htmlContent = converter.makeHtml(mdContent);
      displayContent(htmlContent);
    })
    .catch((error) => {
      console.error("Error loading markdown file:", error);
      displayContent("<p><code>Error: Cannot load content</code></p>");
    });
}

// Display the loaded content in the main content area
function displayContent(content) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = content;
}

// Get the sidebar, content, and toggle button
const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".content");
const toggleButton = document.getElementById("sidebarToggle");

// Add an event listener to toggle the sidebar
toggleButton.addEventListener("click", () => {
  sidebar.classList.toggle("closed"); // Toggle sidebar visibility
  content.classList.toggle("shifted"); // Adjust content margin
  toggleButton.classList.toggle("shifted"); // Adjust the position of the toggle button
});

// Event listener for search input to filter sections and articles
document.getElementById("search").addEventListener("input", searchSections);

// Detect if the screen width is smaller than 768px
function checkScreenSize() {
  if (window.innerWidth <= 768) {
    // Show the popup if the screen is small
    document.getElementById("popup").style.display = "flex";
  } else {
    // Hide the popup if the screen is large
    document.getElementById("popup").style.display = "none";
  }
}

// Close the popup when the button is clicked
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Fetch the structure of articles from index.json
fetch("index.json")
  .then((response) => response.json())
  .then((data) => {
    window.articlesData = data;
    renderNavigation(data); // Render the navigation buttons
    displayIntro(); // Show the introductory content initially
  });

// Run checkScreenSize on page load and resize
window.addEventListener("load", checkScreenSize);
window.addEventListener("resize", checkScreenSize);
