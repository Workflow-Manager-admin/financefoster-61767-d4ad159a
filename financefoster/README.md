# Goalie – Lightweight React Savings Tracker

Goalie is a minimal personal goal and savings tracker with a focus on clear visuals, simplicity, and fun. 👏

## Features

- **Goal-Oriented**: Create personal savings goals and track your progress with vivid pie charts
- **Modern UI**: Uses a custom light blue color palette for an uplifting look
- **No Bank Account Required**: "Piggy bank" style—just for your motivation!
- **Reminders & Habits**: Nudges you to build a savings habit
- **Simple**: No logins, no ads, just your goals

## Important Note: Babel Configuration

This project’s `package.json` includes a `babel` section with a plugin:

```json
"babel": {
  "plugins": ["./.ve/babel-plugin-jsx-editor-id.js"]
}
```

**DO NOT** remove or change this section.

## Getting Started

In the project directory, you can run:

### `npm start`

Runs Goalie in development mode.\
[http://localhost:3000](http://localhost:3000)

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production.

## Color Palette

The color theme is defined as CSS variables in `src/App.css`:

```css
:root {
  --base-light: #7ddfff;   /* Cyan for highlights */
  --base-dark: #1155d4;    /* Accent blue */
  --text-color: #263047;
  --text-secondary: #6c7aa0;
  --border-color: #c3d1e6;
}
```
> See `src/App.js` for JavaScript color usage.

## Components

See `App.js` for all main UI logic.
- Pie chart component for visual progress
- Progress bars
- Habit builder

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
