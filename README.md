# Wedding Registry by Spa Ceylon

A web application to help couples create their wedding registry, manage wishlists, and allow guests to view and mark gifts. This application uses OTP-based authentication, a user-friendly dashboard, and integrates MongoDB for data storage. 

## Features

- **User Authentication**: OTP-based login with phone number as the unique identifier.
- **Create a Registry**: Couples can add their details, wedding date, delivery address, and generate a unique registry code.
- **Wishlist Management**: Couples can add items to their wishlist and preview the registry.
- **Guest Interaction**: Guests can view the registry, mark items as purchased, and updates are visible only to the couple.
- **Gallery**: Couples can upload event pictures for their guests to view.
- **Profile Management**: Couples can edit their profile information, including names, delivery details, and wedding dates.

---

## Project Structure

Will update this ASAP


---

## Installation

### Prerequisites

- **Node.js** (version 16+)
- **MongoDB** database
- A hosting platform (e.g., Vercel, Firebase)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/wedding-registry.git
   cd wedding-registry
2. Install Dependencies:
   ```bash
   npm install
3. Create an .env.local file in the root directory:
   ```bash
   MONGODB_URI=your_mongodb_connection_string
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN = your_auth_token_for_OTP
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   JWT_SECRET=your_jwt_secret
4. Run the development server:
   ```bash
   npm run dev
5. Access the application:
   ```bash
   Open http://localhost:3000 in your browser.

---

### Testing

Run the test suite to ensure the application works as expected:
```bash
npx jest --forceExit --detectOpenHandles


