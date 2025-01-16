# URL Shortener Service

A simple URL shortener built with Node.js and TypeScript. This service allows users to shorten long URLs, track analytics, and manage their shortened URLs.

## Features

- **Unique Hash Generation**: Shorten URLs with a unique identifier.
- **URL Redirection**: Redirect from short URLs to original long URLs.
- **Click Tracking**: Track analytics like location, browser, and device.
- **Expiration Dates**: Set an expiration date for shortened URLs.
- **Manage URLs**: View and delete your shortened URLs.

## Use Cases

- Marketing campaigns to track engagement.
- Social media sharing of short links.
- Custom branded short URLs for promotions.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/url-shortener.git
    cd url-shortener
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory of the project with the following content:
    ```
    MONGO_URI=mongodb://<your-username>:<your-password>@cluster0.mongodb.net/<your-db-name>?retryWrites=true&w=majority
    JWT_SECRET=<your-strong-jwt-secret-key>
    BASE_URL=http://localhost:3000
    PORT=3000
    ```
    - Replace `<your-username>`, `<your-password>`, and `<your-db-name>` with your MongoDB credentials.
    - Set `<your-strong-jwt-secret-key>` to a **strong, secure string** for JWT authentication.

4. Start the application:
    ```bash
    npm run dev
    ```

    The app will start on `http://localhost:3000`.
