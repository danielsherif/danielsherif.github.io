// API Endpoint Testing Script

/**
 * This script tests the connectivity to the Netlify Functions API endpoints
 * It helps diagnose issues with the registration and login endpoints
 */

document.addEventListener("DOMContentLoaded", function () {
  // Create test UI
  const container = document.createElement("div");
  container.className = "container mx-auto p-4 max-w-md";
  container.innerHTML = `
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 class="text-2xl font-bold mb-6 text-center">API Endpoint Test</h1>
      
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Test Configuration</h2>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="base-url">
            API Base URL
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="base-url" type="text" value="https://sweet-cobbler-5c0ef9.netlify.app/.netlify/functions/api">
        </div>
      </div>
      
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Endpoint Tests</h2>
        <div class="space-y-4">
          <button id="test-register" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Test Registration Endpoint
          </button>
          <button id="test-login" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Test Login Endpoint
          </button>
          <button id="test-relative" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Test Relative URL
          </button>
        </div>
      </div>
      
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Results</h2>
        <div id="results" class="bg-gray-100 p-4 rounded h-64 overflow-auto">
          <p class="text-gray-500 italic">Test results will appear here...</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // Get elements
  const baseUrlInput = document.getElementById("base-url");
  const testRegisterBtn = document.getElementById("test-register");
  const testLoginBtn = document.getElementById("test-login");
  const testRelativeBtn = document.getElementById("test-relative");
  const resultsDiv = document.getElementById("results");

  // Helper function to log results
  function logResult(message, isError = false) {
    const logEntry = document.createElement("div");
    logEntry.className = isError ? "text-red-500 mb-2" : "text-green-600 mb-2";
    logEntry.innerHTML = `<p>${new Date().toLocaleTimeString()}: ${message}</p>`;
    resultsDiv.appendChild(logEntry);
    resultsDiv.scrollTop = resultsDiv.scrollHeight;
  }

  // Helper function to test an endpoint
  async function testEndpoint(endpoint, method, data = null) {
    logResult(`Testing ${method} ${endpoint}...`);

    try {
      const options = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      // Log request details
      logResult(
        `Request details: ${JSON.stringify({
          url: endpoint,
          method: method,
          headers: options.headers,
          body: data ? JSON.stringify(data) : "none",
        })}`
      );

      const startTime = performance.now();
      const response = await fetch(endpoint, options);
      const endTime = performance.now();

      const responseTime = Math.round(endTime - startTime);

      try {
        const responseData = await response.json();
        logResult(
          `Response (${responseTime}ms): Status ${
            response.status
          } - ${JSON.stringify(responseData)}`,
          !response.ok
        );
      } catch (e) {
        logResult(
          `Response (${responseTime}ms): Status ${response.status} - Could not parse JSON response`,
          true
        );
      }

      // Log response headers
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      logResult(`Response headers: ${JSON.stringify(headers)}`);
    } catch (error) {
      logResult(`Error: ${error.message}`, true);
      logResult(`This could indicate a CORS issue or network problem`, true);
    }
  }

  // Test registration endpoint
  testRegisterBtn.addEventListener("click", async () => {
    const baseUrl = baseUrlInput.value.trim();
    const endpoint = `${baseUrl}/users/register`;

    const testData = {
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      phone: "01012345678",
      password: "password123",
    };

    await testEndpoint(endpoint, "POST", testData);
  });

  // Test login endpoint
  testLoginBtn.addEventListener("click", async () => {
    const baseUrl = baseUrlInput.value.trim();
    const endpoint = `${baseUrl}/users/login`;

    const testData = {
      email: "test@example.com",
      password: "password123",
    };

    await testEndpoint(endpoint, "POST", testData);
  });

  // Test relative URL
  testRelativeBtn.addEventListener("click", async () => {
    const endpoint = "/api/users/register";

    const testData = {
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      phone: "01012345678",
      password: "password123",
    };

    logResult(`Testing relative URL: ${endpoint}`);
    logResult(`This tests if the netlify.toml redirect is working properly`);

    await testEndpoint(endpoint, "POST", testData);
  });

  // Initial log
  logResult("API Test Tool loaded. Click a button to test endpoints.");
  logResult(`Current origin: ${window.location.origin}`);
  logResult(`User agent: ${navigator.userAgent}`);
});
