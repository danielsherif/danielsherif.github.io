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

        console.log("Response received:", {
          status: response.status,
          statusText: response.statusText,
          headers: [...response.headers.entries()].reduce(
            (obj, [key, value]) => {
              obj[key] = value;
              return obj;
            },
            {}
          ),
        });

        // Check if response is ok before trying to parse JSON
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server response error:", {
            status: response.status,
            statusText: response.statusText,
            errorText: errorText,
            url: response.url,
          });
          throw new Error(
            `Server error: ${response.status} - ${response.statusText} - ${
              errorText || "No error details provided"
            }`
          );
        }

        // Check if response has content before parsing
        const contentType = response.headers.get("content-type");
        console.log("Response content type:", contentType);

        if (!contentType || !contentType.includes("application/json")) {
          console.error("Invalid content type received:", contentType);
          throw new Error("Server didn't return JSON. Got: " + contentType);
        }

        const responseText = await response.text();
        console.log("Response text:", responseText);

        if (!responseText) {
          console.error("Empty response received");
          throw new Error("Empty response from server");
        }

        // Try to parse the JSON response
        let data;
        try {
          console.log("Attempting to parse JSON response");
          data = JSON.parse(responseText);
          console.log("Parsed response data:", data);
        } catch (parseError) {
          console.error(
            "JSON parse error:",
            parseError,
            "Response was:",
            responseText
          );
          throw new Error("Failed to parse server response as JSON");
        }

        console.log("Registration successful, saving user data");
        // Save user data and token to localStorage
        localStorage.setItem("brewAndClayUser", JSON.stringify(data));

        console.log("Redirecting to Home.html");
        // Redirect to home page
        window.location.href = "Home.html";
      } catch (error) {
        console.error("Registration error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
        console.error("Environment info:", {
          userAgent: navigator.userAgent,
          url: window.location.href,
          protocol: window.location.protocol,
          host: window.location.host,
        });
        alert("An error occurred during registration: " + error.message);
      }
    } else {
      console.log("Form validation failed");
    }
  });
});
