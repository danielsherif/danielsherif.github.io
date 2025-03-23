// Client-side validation for signup form
document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signup-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const phoneError = document.getElementById("phone-error");
  const passwordError = document.getElementById("password-error");
  const confirmPasswordError = document.getElementById(
    "confirm-password-error"
  );

  // Validate name (non-empty)
  function validateName(name) {
    return name.trim().length > 0;
  }

  // Validate email format
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Validate phone number format (Egyptian format: 01XXXXXXXXX)
  function validatePhone(phone) {
    const re = /^01\d{9}$/;
    return re.test(phone);
  }

  // Validate password length
  function validatePassword(password) {
    return password.length >= 8;
  }

  // Validate password confirmation
  function validateConfirmPassword(password, confirmPassword) {
    return password === confirmPassword;
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

  // Name validation on blur
  nameInput.addEventListener("blur", function () {
    const isValid = validateName(nameInput.value);
    showError(nameInput, nameError, isValid);
  });

  // Email validation on blur
  emailInput.addEventListener("blur", function () {
    const isValid = validateEmail(emailInput.value);
    showError(emailInput, emailError, isValid);
  });

  // Phone validation on blur
  phoneInput.addEventListener("blur", function () {
    const isValid = validatePhone(phoneInput.value);
    showError(phoneInput, phoneError, isValid);
  });

  // Password validation on blur
  passwordInput.addEventListener("blur", function () {
    const isValid = validatePassword(passwordInput.value);
    showError(passwordInput, passwordError, isValid);

    // Also validate confirm password if it has a value
    if (confirmPasswordInput.value) {
      const isConfirmValid = validateConfirmPassword(
        passwordInput.value,
        confirmPasswordInput.value
      );
      showError(confirmPasswordInput, confirmPasswordError, isConfirmValid);
    }
  });

  // Confirm password validation on blur
  confirmPasswordInput.addEventListener("blur", function () {
    const isValid = validateConfirmPassword(
      passwordInput.value,
      confirmPasswordInput.value
    );
    showError(confirmPasswordInput, confirmPasswordError, isValid);
  });

  // Form submission
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    console.log("Form submission started");
    console.log("Current URL:", window.location.href);
    console.log("API endpoint being called: /api/users/register");

    // Validate all fields
    const isNameValid = showError(
      nameInput,
      nameError,
      validateName(nameInput.value)
    );
    const isEmailValid = showError(
      emailInput,
      emailError,
      validateEmail(emailInput.value)
    );
    const isPhoneValid = showError(
      phoneInput,
      phoneError,
      validatePhone(phoneInput.value)
    );
    const isPasswordValid = showError(
      passwordInput,
      passwordError,
      validatePassword(passwordInput.value)
    );
    const isConfirmPasswordValid = showError(
      confirmPasswordInput,
      confirmPasswordError,
      validateConfirmPassword(passwordInput.value, confirmPasswordInput.value)
    );

    console.log("Validation results:", {
      isNameValid,
      isEmailValid,
      isPhoneValid,
      isPasswordValid,
      isConfirmPasswordValid,
    });

    // If all validations pass
    if (
      isNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      try {
        console.log("All validations passed, preparing to send API request");

        const requestData = {
          name: nameInput.value,
          email: emailInput.value,
          phone: phoneInput.value,
          password: passwordInput.value,
        };

        console.log("Request payload:", JSON.stringify(requestData));
        console.log("Request method: POST");
        console.log("Request headers: Content-Type: application/json");

        // Determine the appropriate API URL based on the current environment
        let apiUrl;

        // Check if we're running locally (file://) or on the production site
        if (window.location.protocol === "file:") {
          // When running locally, use the absolute URL with .netlify/functions path
          apiUrl =
            "https://sweet-cobbler-5c0ef9.netlify.app/.netlify/functions/api/users/register";
          console.log("Running locally, using absolute URL:", apiUrl);
        } else if (
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
        ) {
          // When running on localhost server
          apiUrl = "/.netlify/functions/api/users/register";
          console.log(
            "Running on localhost server, using relative URL:",
            apiUrl
          );
        } else {
          // When running on the deployed site, use the redirect rule
          apiUrl = "/api/users/register";
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

          console.log("User data saved to localStorage");
          console.log("Redirecting to Home.html");

          // Redirect to home page
          window.location.href = "/Html/Home.html";
        } else {
          throw new Error(data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Registration error:", error);

        // Log detailed error information for debugging
        console.log("Error details:", {
          message: error.message,
          stack: error.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
        });

        alert(
          error.message ||
            "An error occurred during registration. Please try again."
        );
      }
    } else {
      console.log("Form validation failed");
    }
  });
});
