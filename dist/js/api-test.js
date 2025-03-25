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
            API Base URL Format
          </label>
          <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="url-format">
            <option value="netlify-functions">/.netlify/functions/api (Standard)</option>
            <option value="api-redirect">/api (Redirect Rule)</option>
            <option value="absolute-netlify-functions">https://sweet-cobbler-5c0ef9.netlify.app/.netlify/functions/api (Absolute Standard)</option>
            <option value="absolute-api-redirect">https://sweet-cobbler-5c0ef9.netlify.app/api (Absolute Redirect)</option>
          </select>
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
          <button id="test-options" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Test OPTIONS Preflight
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
  const urlFormatSelect = document.getElementById("url-format");
  const testRegisterBtn = document.getElementById("test-register");
  const testLoginBtn = document.getElementById("test-login");
  const testOptionsBtn = document.getElementById("test-options");
  const resultsDiv = document.getElementById("results");

  // Helper function to log results
  function logResult(message, isError = false) {
    const logEntry = document.createElement("div");
    logEntry.className = isError ? "text-red-500 mb-2" : "text-green-600 mb-2";
    logEntry.innerHTML = `<p>${new Date().toLocaleTimeString()}: ${message}</p>`;
    resultsDiv.appendChild(logEntry);
    resultsDiv.scrollTop = resultsDiv.scrollHeight;
  }

  // Helper function to get the API URL based on selected format
  function getApiUrl(endpoint) {
    const format = urlFormatSelect.value;
    let baseUrl = "";

    switch (format) {
      case "netlify-functions":
        baseUrl = "/.netlify/functions/api";
        break;
      case "api-redirect":
        baseUrl = "/api";
        break;
      case "absolute-netlify-functions":
        baseUrl =
          "https://sweet-cobbler-5c0ef9.netlify.app/.netlify/functions/api";
        break;
      case "absolute-api-redirect":
        baseUrl = "https://sweet-cobbler-5c0ef9.netlify.app/api";
        break;
      default:
        baseUrl = "/.netlify/functions/api";
    }

    return `${baseUrl}${endpoint}`;
  }

  // Helper function to test an endpoint
  async function testEndpoint(endpoint, method, data = null) {
    const fullUrl = getApiUrl(endpoint);
    logResult(`Testing ${method} ${fullUrl}...`);

    try {
      const options = {
        method: method,
        headers: {
          Origin: window.location.origin,
        },
      };

      // Add Content-Type header only for non-OPTIONS requests with body
      if (method !== "OPTIONS" && data) {
        options.headers["Content-Type"] = "application/json";
      }

      if (data && method !== "OPTIONS") {
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
    const endpoint = "/users/register";

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
    const endpoint = "/users/login";

    const testData = {
      email: "test@example.com",
      password: "password123",
    };

    await testEndpoint(endpoint, "POST", testData);
  });

  // Test OPTIONS preflight request
  testOptionsBtn.addEventListener("click", async () => {
    const endpoint = "/users/login";

    logResult(`Testing OPTIONS preflight request to ${getApiUrl(endpoint)}`);
    logResult(`This tests if CORS preflight is properly configured`);

    await testEndpoint(endpoint, "OPTIONS");
  });

  // Initial log
  logResult(
    "Enhanced API Test Tool loaded. Select a URL format and click a button to test endpoints."
  );
  logResult(`Current origin: ${window.location.origin}`);
  logResult(`User agent: ${navigator.userAgent}`);
  logResult(
    `Select different URL formats to identify which one works correctly.`
  );
  logResult(`The OPTIONS test can help diagnose CORS preflight issues.`);
});
