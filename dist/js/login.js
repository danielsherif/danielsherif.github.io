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
    console.log("API endpoint being called: /api/users/login");

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
        console.log("All validations passed, preparing to send API request");

        const requestData = {
          email: emailInput.value,
          password: passwordInput.value,
        };

        console.log("Request payload:", JSON.stringify(requestData));
        console.log("Request method: POST");
        console.log("Request headers: Content-Type: application/json");

        const response = await fetch(
          "https://sweet-cobbler-5c0ef9.netlify.app/.netlify/functions/api/users/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem("brewAndClayUser", JSON.stringify(data));
        window.location.href = "Home.html";
      } catch (error) {
        console.error("Login error:", error);
        console.log("Error details:", {
          message: error.message,
          stack: error.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
        });

        // Fallback to localStorage for GitHub Pages environment
        const users = JSON.parse(
          localStorage.getItem("brewAndClayUsers") || "[]"
        );
        console.log("Retrieved users from localStorage");

        const user = users.find((user) => user.email === emailInput.value);

        if (!user) {
          console.log("User not found");
          alert("Invalid email or password. Please try again.");
          return;
        }

        console.log("User found, authentication successful");
        localStorage.setItem("brewAndClayUser", JSON.stringify(user));
        window.location.href = "Home.html";
      }
    } else {
      console.log("Form validation failed");
    }
  });
});
