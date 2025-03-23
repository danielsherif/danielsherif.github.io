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
        console.log("All validations passed, preparing to send API request");

        const requestData = {
          email: emailInput.value,
          password: passwordInput.value,
        };

        console.log("Request payload:", JSON.stringify(requestData));
        console.log("Request method: POST");
        console.log("Request headers: Content-Type: application/json");

        // Determine the appropriate API URL based on the current environment
        let apiUrl;

        // Check if we're running locally (file://) or on the production site
        if (window.location.protocol === "file:") {
          // When running locally, use the absolute URL
          apiUrl =
            "https://sweet-cobbler-5c0ef9.netlify.app/.netlify/functions/api/users/login";
          console.log("Running locally, using absolute URL:", apiUrl);
        } else if (
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
        ) {
          // When running on localhost server
          apiUrl = "/.netlify/functions/api/users/login";
          console.log(
            "Running on localhost server, using relative URL:",
            apiUrl
          );
        } else {
          // When running on the deployed site, use the redirect rule
          apiUrl = "/api/users/login";
          console.log("Running on deployed site, using redirect URL:", apiUrl);
        }

        console.log("Using API URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (response.ok) {
          // Store user data and token in localStorage
          localStorage.setItem(
            "brewAndClayUser",
            JSON.stringify({
              name: data.name,
              email: data.email,
              phone: data.phone,
              token: data.token,
            })
          );

          // Redirect to home page
          window.location.href = "/Html/Home.html";
        } else {
          throw new Error(data.message || "Authentication failed");
        }
      } catch (error) {
        console.error("Login error:", error);

        // Log detailed error information for debugging
        console.log("Error details:", {
          message: error.message,
          stack: error.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
        });

        alert(
          error.message || "An error occurred during login. Please try again."
        );
      }
    } else {
      console.log("Form validation failed");
    }
  });
});
