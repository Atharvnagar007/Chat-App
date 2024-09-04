# Chat Application Prototype

## Overview

A feature-rich chat application built with React.js. This app offers seamless video calling, user blocking, chat deletion, and screen sharing capabilities. Additionally, it supports capturing through the camera for a comprehensive communication experience.


## Features

This chat application comes with a range of features designed to enhance user communication:

- **Real-time Chat**: Communicate instantly with other users in real-time.
- **Video Calling**: High-quality video calling integrated using ZegoUIKitPrebuilt.
- **User Blocking**: Block users to prevent unwanted communication.
- **Chat Deletion**: Delete individual chats to maintain privacy.
- **Screen Sharing**: Share your screen during video calls for better collaboration.
- **Camera Capture**: Capture images directly within the chat interface using your device’s camera.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Ensure that Node.js is installed on your local machine. You can download it [here](https://nodejs.org/).
- **npm**: npm is installed with Node.js, but make sure it’s updated.
- **Firebase Account**: Set up a Firebase project to manage real-time data and authentication.

## Installation

Follow these steps to get the application up and running on your local machine:

```bash
# Clone the GitHub repository
git clone https://github.com/Atharvnagar007/Chat-App.git

# Change directory to the project folder
cd react-firebase-chat

# Install the dependencies
npm install
npm install -g create-vite

# Install Firebase dependencies (required for real-time database and authentication)
npm install firebase

# Install React and ReactDOM
npm install react react-dom

# Install ZegoUIKit for video conferencing
npm install @zegocloud/zego-uikit-prebuilt

# Install Zustand for state management
npm install zustand

# Run the development server
npm run dev
```
## Configuration

### Firebase Setup

To run this application, you need to configure Firebase:

1. **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. **Enable Authentication**: Navigate to the **Authentication** section and enable **Email/Password authentication**.

3. **Create a Firestore Database**: Set up a Firestore database in **test mode** for real-time data handling.

4. **Firebase Configuration File**: After setting up Firebase, create a configuration file in your project:

   ```javascript
   // src/firebase.js
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   export default firebaseConfig;

## Project Structure

Understanding the project structure is crucial for navigating and modifying the application:

```plaintext
react-firebase-chat/
├── public/                   # Static files (index.html, images, etc.)
├── src/                      # Main application source code
│   ├── components/           # Reusable components (e.g., ChatBox, VideoCall, list)
│   ├── lib/                  # Firebase files          
│   ├── App.js                # Main application component
│   └── index.js              # Entry point of the application
├── .gitignore                # Git ignore file
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation
```
## Usage

### Starting the Application

After installation, you can start the development server:

```bash
npm run dev
```
### The application will be accessible at some port which will be available by default.


## Demo Video
[Watch the demo](public/App-work.mp4)

## Video-Calling demo
[Watch the demo](public/video-demo.mp4)

## System Design
[Link to document (Please open canvas on the given Website)](https://app.eraser.io/workspace/2v6yuru08JYYfJTeqgtc?origin=share) 

## Contribution

- **Name**: Atharv Nagar
- **University**: IIT Tirupati
- **Department**: Mechanical Engineering

