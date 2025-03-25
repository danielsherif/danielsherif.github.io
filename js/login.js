// Client-side validation and authentication for login form
const API_URL = "https://sweet-cobbler-5c0ef9.netlify.app/api";

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
    showError(emailInput, emailError, validateEmail(emailInput.value));
  });

  // Password validation on blur
  passwordInput.addEventListener("blur", function () {
    showError(
      passwordInput,
      passwordError,
      validatePassword(passwordInput.value)
    );
  });

  // Form submission
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    console.log("Login form submission started");

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

    if (isEmailValid && isPasswordValid) {
      try {
        console.log("Sending login request...");

        const response = await fetch(`${API_URL}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value,
          }),
        });

        if (!response.ok) {
          throw new Error("Invalid login credentials");
        }

        const data = await response.json();
        localStorage.setItem("brewAndClayUser", JSON.stringify(data));

        console.log("Login successful, redirecting...");
        window.location.href = "/Html/Home.html";
      } catch (error) {
        console.error("Login error:", error);
        alert(
          error.message || "An error occurred during login. Please try again."
        );
      }
    } else {
      console.log("Form validation failed");
    }
  });
});
