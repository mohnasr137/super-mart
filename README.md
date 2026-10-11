# 🛒 SuperMarket REST API

A modern, robust, and secure E-commerce RESTful API built with **Node.js**, **Express**, and **MongoDB (Mongoose)**. The API powers full customer shopping journeys—including account management with email verification, token-based authentication, product catalog discovery, shopping cart & favorites (wishlist) management, and user profile management with image uploads.

---

## 🚀 Key Features

- **Authentication & Security**:
  - Secure signup with password hashing using `bcryptjs` (salt rounds: 10).
  - Email verification links via `Nodemailer` (Gmail SMTP).
  - JWT token authentication (`Bearer <token>`).
  - Role-based authorization (`user` & `admin`).
  - Password reset with time-limited 6-digit verification codes (15-min expiration).
  - Rate limiting via `express-rate-limit` (100 requests per 15 minutes).
  - HTTP security headers with `Helmet`.
  - Cross-Origin Resource Sharing (CORS) enabled.
- **Product Catalog**:
  - Paginated browsing with sorting and field selection.
  - Search and multi-criteria filtering (category, brand, rating, discount, price).
  - Categories with representative images.
  - Brands with unique icons/emojis and deduplication.
  - Single product retrieval and simulated CRUD operations.
- **Cart & Favorites (Wishlist)**:
  - Add to cart with support for `quantity`.
  - Update cart item quantity or remove individual items.
  - One-click clear cart.
  - Wishlist (favorites) add, remove, and clear operations.
- **User Profile & Media**:
  - Profile retrieval and update (`name`, `phone`, `address`, `gender`).
  - Avatar image upload with file type filtering (`Multer`: JPEG, PNG, WebP) and 5MB size limit.
  - Automatic cleanup of previously uploaded images.
- **Developer Experience**:
  - Environment variable validation at server boot.
  - Graceful shutdown handlers closing HTTP server and MongoDB connections.
  - Centralized JSON error handling and catch-all 404 responses.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose 8](https://mongoosejs.com/)
- **Authentication**: [jsonwebtoken (JWT)](https://jwt.io/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Email Service**: [Nodemailer](https://nodemailer.com/)
- **Uploads**: [Multer](https://github.com/expressjs/multer)
- **Security**: [Helmet](https://helmetjs.github.io/), [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit), [CORS](https://github.com/expressjs/cors)
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## 📁 Directory Structure

```text
SuperMarket/
├── config/
│   ├── db.js                 # MongoDB connection & lifecycle listeners
│   └── env.js                # Environment variable validation
├── controllers/
│   ├── auth/
│   │   ├── basicAuth.js      # Sign-up and Sign-in controllers
│   │   ├── resetPassword.js  # Password reset flow controllers
│   │   └── verifyEmail.js    # Email verification controllers & mail sender
│   └── home/
│       ├── basicUser.js      # Cart and favorites controllers
│       ├── bacicUser.js      # Backwards-compatibility proxy
│       ├── portfolio.js      # User profile and avatar upload controllers
│       └── show.js           # Products, categories, and brands controllers
├── images/                   # Static image assets
│   ├── banners/
│   ├── brands/
│   ├── categories/
│   └── portfolio/            # Uploaded user avatars
├── middlewares/
│   └── auth.js               # JWT protection & role restriction middlewares
├── models/
│   ├── image.js              # Image buffer schema
│   └── user.js               # User Mongoose schema & pre-save hook
├── routers/
│   ├── authRouters.js        # Authentication endpoints
│   ├── homeRouters.js        # Product & catalog endpoints
│   ├── portfoiloRouters.js   # Profile & media endpoints
│   └── user.js               # Cart & favorites endpoints
├── utils/
│   └── adminSeeder.js        # Admin user seeder script
├── .env.example              # Environment variables template
├── app.js                    # Express app configuration & middleware pipeline
├── package.json              # Project dependencies and scripts
└── server.js                 # Server entry point & graceful shutdown
```

---

## ⚙️ Prerequisites

1. **Node.js**: v18.0.0 or higher
2. **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster URI
3. **Gmail Account**: With an [App Password](https://myaccount.google.com/apppasswords) for SMTP email sending

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env` by copying `.env.example`:

```bash
cp .env.example .env
```

Configure your environment settings:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | HTTP Server port | `5000` |
| `NODE_ENV` | Application environment | `development` |
| `API_URL` | Base API prefix | `/api/v1` |
| `URL` | Public base URL | `http://localhost:5000` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://localhost:27017/supermarket` |
| `JWT_SECRET` | Secret key for signing tokens | `your_secret_key` |
| `JWT_EXPIRE` | Token expiration period | `30d` |
| `ADMIN_USERNAME`| Default admin name for seeder | `admin` |
| `ADMIN_EMAIL` | Default admin email | `admin@example.com` |
| `ADMIN_PASSWORD` | Default admin password | `Admin@123456` |
| `GMAIL_USER` | Gmail address for emails | `your_email@gmail.com` |
| `GMAIL_PASSWORD` | Gmail App Password (16 chars) | `xxxx xxxx xxxx xxxx` |

### 3. Run the Server

**Development mode** (with nodemon):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

---

## 📡 API Reference

Base URL: `http://localhost:<PORT>/api/v1`

### 1. Authentication (`/auth`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/auth/signUp` | None | Register new user & send verification email |
| `POST` | `/auth/signIn` | None | Log in and receive JWT token |
| `GET` | `/auth/:token` | None | Verify account via token link |
| `POST` | `/auth/resetPassCode` | None | Send 6-digit password reset code to email |
| `POST` | `/auth/activeResetPass` | None | Verify 6-digit reset code |
| `POST` | `/auth/resetPassword` | None | Set new password with verified code |

#### Sign Up Payload (`POST /auth/signUp`):
```json
{
  "name": "Alex Smith",
  "phone": "+1234567890",
  "email": "alex@example.com",
  "password": "Password@123",
  "confirmPassword": "Password@123"
}
```

#### Sign In Payload (`POST /auth/signIn`):
```json
{
  "email": "alex@example.com",
  "password": "Password@123"
}
```

---

### 2. Products & Catalog (`/home`)

All endpoints below require header: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/home/products` | Get products (`?skip=0&limit=10&sortBy=price&order=asc&select=title,price`) |
| `POST` | `/home/productsFilter` | Advanced filtering by `search`, `category`, `brand`, `rating`, `price` |
| `GET` | `/home/products/:id` | Get single product details |
| `GET` | `/home/categories` | Get all product categories with images |
| `GET` | `/home/categories/names`| Get category names list |
| `GET` | `/home/brands` | Get brands with emoji badges |
| `GET` | `/home/brands/names` | Get clean list of unique brand names |
| `GET` | `/home/products/category/:category` | Get products by category |
| `GET` | `/home/products/brand/:brand` | Get products by brand |
| `POST` | `/home/products` | Add new product (simulated) |
| `PUT / PATCH` | `/home/products/:id` | Update product |
| `DELETE` | `/home/products/:id` | Delete product |

---

### 3. Cart & Favorites (`/user`)

Requires header: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/user/getCart` | Get items in shopping cart |
| `POST` | `/user/addCart` | Add item to cart (`{ "productId": 1, "quantity": 2 }`) |
| `PUT` | `/user/updateCart` | Update quantity (`{ "productId": 1, "quantity": 3 }`) |
| `DELETE` | `/user/deleteCart` | Remove item from cart (`{ "productId": 1 }`) |
| `DELETE` | `/user/clearCart` | Empty entire shopping cart |
| `GET` | `/user/getFavorite` | Get items in wishlist/favorites |
| `POST` | `/user/addFavorite` | Add item to favorites (`{ "productId": 1 }`) |
| `DELETE` | `/user/deleteFavorite` | Remove item from favorites (`{ "productId": 1 }`) |
| `DELETE` | `/user/clearFavorite` | Empty entire favorites list |

*Note: RESTful aliases are also available: `/user/cart`, `/user/favorites`.*

---

### 4. User Profile & Media (`/portfolio`)

Requires header: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/portfolio/userData` | Get logged-in user profile |
| `POST` | `/portfolio/editUserData` | Update profile (`name`, `phone`, `address`, `gender`) |
| `POST` | `/portfolio/addImage` | Upload avatar (multipart/form-data with key `file`) |

---

## 🧪 Quick Test with cURL

### 1. Check API Health
```bash
curl -X GET http://localhost:5000/api/v1
```

### 2. User Registration
```bash
curl -X POST http://localhost:5000/api/v1/auth/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "user@example.com",
    "password": "Password@123",
    "confirmPassword": "Password@123"
  }'
```

### 3. User Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/signIn \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password@123"
  }'
```

### 4. Fetch Products (Authenticated)
```bash
curl -X GET "http://localhost:5000/api/v1/home/products?limit=5" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### 5. Add to Cart (Authenticated)
```bash
curl -X POST http://localhost:5000/api/v1/user/addCart \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

---

## 🔧 Troubleshooting & Common Issues

- **Gmail Authentication Error (`535-5.7.8 Username and Password not accepted`)**:
  - Make sure **2-Step Verification** is turned on in your Google Account.
  - Generate a dedicated **16-character App Password** via [Google App Passwords](https://myaccount.google.com/apppasswords) and put it into `GMAIL_PASSWORD` (do not use your regular Gmail login password).
- **MongoDB Connection Timed Out**:
  - If using MongoDB Atlas, ensure your current IP address is whitelisted in Atlas Network Access (`0.0.0.0/0` for development).
  - Verify that your `MONGO_URI` connection string includes proper credentials.
- **Rate Limit (`429 Too Many Requests`)**:
  - The API allows up to 100 requests per 15-minute window per IP. During testing, adjust `limiter` in `app.js` if necessary.
- **File Upload Issues**:
  - Only JPEG, PNG, and WebP images up to 5MB are accepted. Use form-data field name `file`.

---

## 🔒 Security Summary

- **Hashing**: All passwords hashed using `bcryptjs` before persisting.
- **Expirations**: Verification codes and reset tokens expire automatically to prevent replay attacks.
- **Graceful Shutdown**: Listens to `SIGINT` / `SIGTERM` signals and cleanly closes active connections.
- **CORS & Headers**: Strict headers via `helmet` and configurable CORS options.

---

## 📄 License

This project is licensed under the **ISC License**.

