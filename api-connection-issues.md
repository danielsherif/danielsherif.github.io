# API Connection Issues Documentation

## Overview

This document details the ongoing API connection issues between our GitHub Pages frontend (brewandclay.me) and Netlify Functions backend. We're experiencing persistent 405 Method Not Allowed errors when attempting to make API calls from the frontend to our serverless functions.

## Current Setup

- **Frontend**: Hosted on GitHub Pages with custom domain brewandclay.me
- **Backend**: Netlify Functions (serverless) at https://sweet-cobbler-5c0ef9.netlify.app/.netlify/functions/api
- **API Implementation**: Express.js running as serverless function
- **CORS Configuration**: Configured to allow requests from brewandclay.me, sweet-cobbler-5c0ef9.netlify.app, and localhost:3000

## The Issue

When making POST requests from the frontend to the backend API endpoints, we receive 405 Method Not Allowed errors. The browser console shows:

```
Access to fetch at 'https://sweet-cobbler-5c0ef9.netlify.app/.netlify/functions/api/users/register' from origin 'https://brewandclay.me' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Methods' header is present on the requested resource.
```

Or sometimes:

```
Failed to load resource: the server responded with a status of 405 (Method Not Allowed)
```

The network tab shows that the preflight OPTIONS request fails with a 405 status code, preventing the actual POST request from being sent.

## Attempted Solutions

### 1. CORS Configuration

We've configured CORS in our Netlify Function (api.js) to allow requests from our domains:

```javascript
app.use(
  cors({
    origin: [
      "https://brewandclay.me",
      "https://sweet-cobbler-5c0ef9.netlify.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
```

However, this doesn't seem to be properly handling the OPTIONS preflight requests.

### 2. Netlify Redirects

We've set up redirects in netlify.toml to allow cleaner API URLs:

```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

This allows us to use `/api/users/register` instead of `/.netlify/functions/api/users/register`, but the issue persists with both URL formats.

### 3. Testing with Different URL Formats

We've tried both absolute and relative URLs:

- Absolute: `https://sweet-cobbler-5c0ef9.netlify.app/.netlify/functions/api/users/register`
- Relative: `/api/users/register`

Both approaches result in the same 405 error.

### 4. API Test Tool

We created a dedicated API test tool (ApiTest.html and api-test.js) to diagnose the issue. The tool allows testing different endpoints and URL formats, but all tests show the same 405 error.

Test results show:

```
Request details: {"url":"https://sweet-cobbler-5c0ef9.netlify.app/.netlify/functions/api/users/register","method":"POST","headers":{"Content-Type":"application/json","Origin":"https://brewandclay.me"},"body":"{\"name\":\"Test User\",\"email\":\"test1234567890@example.com\",\"phone\":\"01012345678\",\"password\":\"password123\"}"}

Response (1250ms): Status 405 - Could not parse JSON response

Response headers: {"content-type":"text/html; charset=utf-8"}
```

Notice that the response is HTML instead of JSON, suggesting the request isn't reaching our Express API handler.

## Current Status

- API calls from the frontend to the backend consistently fail with 405 errors
- The response is HTML instead of JSON, indicating the request isn't being processed by our Express API
- CORS preflight requests (OPTIONS) are failing
- The issue occurs on both the production domain (brewandclay.me) and the Netlify domain
- Local development environment shows the same issues

## Next Steps to Consider

1. **Netlify Function Configuration**: Investigate if there's a specific Netlify Functions configuration needed to handle OPTIONS requests properly

2. **Express Middleware Order**: Check if the order of middleware in api.js might be affecting the CORS handling

3. **Custom OPTIONS Handler**: Add an explicit handler for OPTIONS requests in our Express app:

   ```javascript
   app.options("*", cors()); // Enable pre-flight for all routes
   ```

4. **Headers Investigation**: Use a tool like Postman to examine the exact headers being sent and received

5. **Netlify Support**: Consider reaching out to Netlify support as this might be related to how their Functions platform handles preflight requests

## Technical Details

### Network Request Details

**Request Headers:**

```
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type
Origin: https://brewandclay.me
```

**Response Headers (from failed request):**

```
content-type: text/html; charset=utf-8
```

### Expected vs Actual Response

**Expected:**

- Status: 200 OK
- Headers including: Access-Control-Allow-Origin, Access-Control-Allow-Methods
- JSON response from our API

**Actual:**

- Status: 405 Method Not Allowed
- HTML response instead of JSON
- Missing CORS headers

This documentation will be updated as we make progress on resolving the issue.
