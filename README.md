# 🔐 Facial Authentication Using ServiceNow Service Portal

A proof-of-concept facial authentication system that combines the **ServiceNow Service Portal** with a JavaScript-based face recognition library and a Node.js backend.

The project explores how users can register their face through a webcam and use facial matching as part of a custom authentication workflow.

## ✨ Features

- 📷 Webcam-based face capture
- 🧑 User registration with facial data
- 🔍 Face detection and descriptor matching
- 🔗 REST API communication between ServiceNow and the backend
- 🗄️ User data and face descriptors stored in MongoDB
- 🖥️ Custom ServiceNow Service Portal interface
- ✅ Authentication result shown to the user

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| ServiceNow Service Portal | User interface and portal experience |
| AngularJS / JavaScript | Widget interactions and client-side logic |
| face-api.js | Face detection, landmarks, and face descriptors |
| Node.js | Backend runtime |
| Express.js | REST API endpoints |
| MongoDB | Stores user details and face descriptors |
| REST APIs | Communication between ServiceNow and backend |

> **Architecture note:** This project uses ServiceNow plus a Node.js/Express backend and MongoDB. It is not a fully ServiceNow-only implementation.

## 🏗️ How It Works

```text
User
  ↓
ServiceNow Service Portal
  ↓
Webcam + face-api.js
  ↓
Face descriptor
  ↓ REST API
Node.js + Express.js
  ↓
MongoDB
  ↓
Match result returned to the portal
```

### Registration flow
1. The user enters their details and allows webcam access.
2. `face-api.js` detects the face and generates a face descriptor.
3. The portal sends the required data to the backend through a REST API.
4. The backend stores the user details and descriptor in MongoDB.

### Login flow
1. The user opens the facial authentication page and allows webcam access.
2. The application generates a descriptor from the current face.
3. The backend retrieves the registered descriptor and performs the configured matching process.
4. The result is returned to the ServiceNow portal, which displays whether a match was found.

## 📁 Suggested Project Structure

```text
facial-authentication-servicenow/
├── servicenow/
│   └── service-portal-widget/
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── server.js
│   └── package.json
├── README.md
└── .gitignore
```

*This is a suggested structure; adapt it to match your actual repository.*

## ⚙️ Setup Overview

### 1. ServiceNow
- Create or configure the Service Portal page and widget.
- Add the registration and authentication interface.
- Configure the API endpoint and handle the API response.
- Apply appropriate roles, access controls, and server-side validation.

### 2. Backend
- Install a supported Node.js version.
- Install the project's dependencies.
- Configure the Express routes and MongoDB connection.
- Set required environment variables.
- Run the backend and test the API endpoints.

Example commands (adjust to your actual backend):

```bash
cd backend
npm install
npm start
```

### 3. Face models
Make sure the `face-api.js` library and its required model files are loaded from a trusted, accessible location. The browser must be able to access them.

### 4. Configure the connection
Set the correct backend base URL for your environment. Use HTTPS for deployed environments and configure CORS narrowly for trusted origins.

## 🔒 Security Notes

This project is a **learning proof of concept**, not a production-ready biometric authentication system.

- Face descriptors are sensitive biometric-related data. Protect them and restrict access.
- Never store passwords, API secrets, or credentials in client-side code or a public repository.
- Use HTTPS, authentication, authorization, input validation, and rate limiting for backend APIs.
- Add liveness detection and anti-spoofing controls before considering real-world use.
- Do not rely on face matching alone for high-risk access. Use an approved identity provider and follow organizational security and privacy requirements.
- Define retention and deletion policies for biometric data and obtain appropriate user consent.

## 🚧 Current Scope and Future Improvements

Potential improvements:
- Liveness detection and spoofing resistance
- Stronger API authorization and audit logging
- Better error handling and accessibility
- Integration with an approved enterprise identity provider
- Clear consent, retention, and deletion workflows
- Automated tests for registration and login flows

## 🎯 Learning Outcomes

- Building interactive ServiceNow Service Portal widgets
- Connecting ServiceNow with an external REST API
- Using Node.js and Express.js for backend services
- Working with MongoDB
- Exploring face detection and descriptor matching
- Understanding the security considerations of biometric-related workflows

## ⚠️ Disclaimer

This project is intended for educational and demonstration purposes. Face detection or descriptor matching does not, by itself, establish a person's identity securely. Do not use this proof of concept as the sole authentication mechanism in a production environment.

---

**Built with:** ServiceNow Service Portal · JavaScript · face-api.js · Node.js · Express.js · MongoDB
