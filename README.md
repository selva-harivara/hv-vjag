# Admin Panel

A modern admin panel built with React, TypeScript, and Material-UI.

## Features

- User authentication (login, register, forgot password)
- Responsive layout with collapsible sidebar
- Protected routes
- User context management
- Modern UI with Material-UI components

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd admin-panel
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── contexts/      # Context providers
  ├── pages/         # Page components
  ├── theme.ts       # MUI theme configuration
  ├── App.tsx        # Main application component
  └── index.tsx      # Application entry point
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App

## Authentication

The application includes a basic authentication system with the following features:

- User registration
- User login
- Password reset
- Protected routes
- User context management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
