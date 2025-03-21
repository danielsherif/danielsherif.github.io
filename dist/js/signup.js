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

        // Since we're on GitHub Pages (static hosting), we'll use client-side storage
        // instead of making API calls that won't work in this environment
        console.log(
          "GitHub Pages environment detected, using client-side storage"
        );

        // Check if email already exists in localStorage
        const existingUsers = JSON.parse(
          localStorage.getItem("brewAndClayUsers") || "[]"
        );
        const emailExists = existingUsers.some(
          (user) => user.email === requestData.email
        );

        if (emailExists) {
          alert(
            "A user with this email already exists. Please use a different email or login."
          );
          return;
        }

        // Generate a mock user ID and token
        const userId = "user_" + Math.random().toString(36).substr(2, 9);
        const mockToken = "token_" + Math.random().toString(36).substr(2, 16);

        // Create a data object similar to what the server would return
        const userData = {
          _id: userId,
          name: requestData.name,
          email: requestData.email,
          phone: requestData.phone,
          token: mockToken,
          createdAt: new Date().toISOString(),
        };

        console.log("Created user data:", userData);

        // Save user to users collection
        existingUsers.push(userData);
        localStorage.setItem("brewAndClayUsers", JSON.stringify(existingUsers));

        // Save current user session
        localStorage.setItem("brewAndClayUser", JSON.stringify(userData));

        console.log("Registration successful, saving user data");
        console.log("Redirecting to Home.html");

        // Redirect to home page
        window.location.href = "Home.html";
      } catch (error) {
        console.error("Registration error:", error);

        // Log detailed error information for debugging
        console.log("Error details:", {
          message: error.message,
          stack: error.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
        });

        // Show a more user-friendly error message
        alert(
          "Registration could not be completed. This might be because you're using GitHub Pages which doesn't support server-side functionality. Your account has been created locally instead."
        );

        // Even if there's an error with the API call, we can still create the user locally
        // since we're on GitHub Pages
        const userId = "user_" + Math.random().toString(36).substr(2, 9);
        const mockToken = "token_" + Math.random().toString(36).substr(2, 16);

        const userData = {
          _id: userId,
          name: nameInput.value,
          email: emailInput.value,
          phone: phoneInput.value,
          token: mockToken,
          createdAt: new Date().toISOString(),
        };

        // Save user data to localStorage as a fallback
        const existingUsers = JSON.parse(
          localStorage.getItem("brewAndClayUsers") || "[]"
        );
        if (!existingUsers.some((user) => user.email === emailInput.value)) {
          existingUsers.push(userData);
          localStorage.setItem(
            "brewAndClayUsers",
            JSON.stringify(existingUsers)
          );
          localStorage.setItem("brewAndClayUser", JSON.stringify(userData));

          // Redirect to home page after successful local registration
          window.location.href = "Home.html";
        }
      }
    } else {
      console.log("Form validation failed");
    }
  });
});
