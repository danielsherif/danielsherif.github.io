// Client-side validation and authentication for signup form
const API_URL =
  "https://sweet-cobbler-5c0ef9.netlify.app/.netlify/functions/api";

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
    showError(nameInput, nameError, validateName(nameInput.value));
  });

  // Email validation on blur
  emailInput.addEventListener("blur", function () {
    showError(emailInput, emailError, validateEmail(emailInput.value));
  });

  // Phone validation on blur
  phoneInput.addEventListener("blur", function () {
    showError(phoneInput, phoneError, validatePhone(phoneInput.value));
  });

  // Password validation on blur
  passwordInput.addEventListener("blur", function () {
    showError(
      passwordInput,
      passwordError,
      validatePassword(passwordInput.value)
    );
  });

  // Confirm password validation on blur
  confirmPasswordInput.addEventListener("blur", function () {
    showError(
      confirmPasswordInput,
      confirmPasswordError,
      validateConfirmPassword(passwordInput.value, confirmPasswordInput.value)
    );
  });

  // Form submission
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    console.log("Signup form submission started");

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

    if (
      isNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      try {
        console.log("Sending signup request...");

        const response = await fetch(`${API_URL}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            password: passwordInput.value,
          }),
        });

        if (!response.ok) {
          throw new Error("Registration failed");
        }

        const data = await response.json();
        localStorage.setItem("brewAndClayUser", JSON.stringify(data));

        console.log("Signup successful, redirecting...");
        window.location.href = "/Html/Home.html";
      } catch (error) {
        console.error("Signup error:", error);
        alert(
          error.message || "An error occurred during signup. Please try again."
        );
      }
    } else {
      console.log("Form validation failed");
    }
  });
});
