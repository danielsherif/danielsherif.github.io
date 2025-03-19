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

    // If all validations pass
    if (isEmailValid && isPasswordValid) {
      try {
        const response = await fetch("/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Save user data and token to localStorage
          localStorage.setItem("brewAndClayUser", JSON.stringify(data));

          // Redirect to home page
          window.location.href = "Home.html";
        } else {
          // Show error message
          alert(data.message || "Login failed. Please try again.");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred. Please try again later.");
      }
    }
  });
});
