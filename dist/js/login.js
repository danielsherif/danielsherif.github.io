// Client-side validation and authentication for login form
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  // Validate email format
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Validate password length
  function validatePassword(password) {
    return password.length >= 8;
  }

  // Show error message
  function showError(input, errorElement, isValid) {
    if (!isValid) {
      input.classList.add("border-red-500");
      errorElement.classList.remove("hidden");
    } else {
      input.classList.remove("border-red-500");
      errorElement.classList.add("hidden");
    }
    return isValid;
  }

  // Email validation on blur
  emailInput.addEventListener("blur", function () {
    const isValid = validateEmail(emailInput.value);
    showError(emailInput, emailError, isValid);
  });

  // Password validation on blur
  passwordInput.addEventListener("blur", function () {
    const isValid = validatePassword(passwordInput.value);
    showError(passwordInput, passwordError, isValid);
  });

  // Form submission
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    console.log("Login form submission started");
    console.log("Current URL:", window.location.href);

    // Validate all fields
    const isEmailValid = showError(
      emailInput,
      emailError,
      validateEmail(emailInput.value)
    );
    const isPasswordValid = showError(
      passwordInput,
      passwordError,
      validatePassword(passwordInput.value)
    );

    console.log("Validation results:", {
      isEmailValid,
      isPasswordValid,
    });

    // If all validations pass
    if (isEmailValid && isPasswordValid) {
      try {
        console.log("All validations passed, preparing to authenticate");
        console.log(
          "GitHub Pages environment detected, using client-side storage"
        );

        // Get users from localStorage
        const users = JSON.parse(
          localStorage.getItem("brewAndClayUsers") || "[]"
        );
        console.log("Retrieved users from localStorage");

        // Find user with matching email
        const user = users.find((user) => user.email === emailInput.value);

        if (!user) {
          console.log("User not found");
          alert("Invalid email or password. Please try again.");
          return;
        }

        // In a real app, we would hash and compare passwords
        // For this GitHub Pages demo, we're simplifying authentication
        // In a production environment, NEVER store or compare plain text passwords

        // Since we don't store passwords in localStorage for security reasons,
        // we'll simulate successful authentication for demo purposes
        console.log("User found, authentication successful");

        // Save user data to localStorage
        localStorage.setItem("brewAndClayUser", JSON.stringify(user));
        console.log("User data saved to localStorage");
        console.log("Redirecting to Home.html");

        // Redirect to home page
        window.location.href = "Home.html";
      } catch (error) {
        console.error("Login error:", error);

        // Log detailed error information for debugging
        console.log("Error details:", {
          message: error.message,
          stack: error.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
        });

        alert("An error occurred during login. Please try again later.");
      }
    } else {
      console.log("Form validation failed");
    }
  });
});
