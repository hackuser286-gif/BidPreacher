// Get the toggle button
const toggleButton = document.getElementById("toggleTheme");

// Function to toggle theme
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "light") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

// Attach click event to the button
toggleButton.addEventListener("click", toggleTheme);
