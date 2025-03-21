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

        const response = await fetch("/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem("brewAndClayUser", JSON.stringify(data));
        window.location.href = "Home.html";
      } catch (error) {
        console.error("Registration error:", error);
        console.log("Error details:", {
          message: error.message,
          stack: error.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
        });

        // Fallback to localStorage for GitHub Pages environment
        const existingUsers = JSON.parse(
          localStorage.getItem("brewAndClayUsers") || "[]"
        );

        if (existingUsers.some((user) => user.email === requestData.email)) {
          alert(
            "A user with this email already exists. Please use a different email or login."
          );
          return;
        }

        const userId = "user_" + Math.random().toString(36).substr(2, 9);
        const mockToken = "token_" + Math.random().toString(36).substr(2, 16);

        const userData = {
          _id: userId,
          name: requestData.name,
          email: requestData.email,
          phone: requestData.phone,
          token: mockToken,
          createdAt: new Date().toISOString(),
        };

        existingUsers.push(userData);
        localStorage.setItem("brewAndClayUsers", JSON.stringify(existingUsers));
        localStorage.setItem("brewAndClayUser", JSON.stringify(userData));

        alert("Registration successful! Redirecting to home page...");
        window.location.href = "Home.html";
      }
    } else {
      console.log("Form validation failed");
    }
  });
});
