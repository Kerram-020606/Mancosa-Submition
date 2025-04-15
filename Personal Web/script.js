const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
const body = document.body;

// Check the current theme from localStorage on page load
window.addEventListener('load', () => {
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    body.classList.remove('light-theme');
    themeToggleCheckbox.checked = true;
  } else {
    body.classList.add('light-theme');
    body.classList.remove('dark-theme');
    themeToggleCheckbox.checked = false;
  }
});

// Check current theme on page load
window.addEventListener('load', () => {
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    body.classList.remove('light-theme');
    themeToggleCheckbox.checked = true;
  } else {
    body.classList.add('light-theme');
    body.classList.remove('dark-theme');
    themeToggleCheckbox.checked = false;
  }
});

// Toggle between light and dark themes
themeToggleCheckbox.addEventListener('change', () => {
  if (themeToggleCheckbox.checked) {
    body.classList.add('dark-theme');
    body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.add('light-theme');
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
});

// Add event listener to toggle dark/light mode
themeToggleCheckbox.addEventListener('change', () => {
  if (themeToggleCheckbox.checked) {
    body.classList.add('dark-theme');
    body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.add('light-theme');
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
});

   // Form reset after submission
   const form = document.getElementById('contact-form');
   form.addEventListener('submit', (event) => {
     event.preventDefault(); // Prevent default form submission behavior
     
     // Simulate form submission (you can replace this with an actual API call if needed)
     alert('Form submitted!');

     // Reset the form
     form.reset();
   })
   
