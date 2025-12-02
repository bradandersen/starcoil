# StarCoil Generator

An interactive web-based tool for generating and visualizing star coil patterns. This project ports the logic from a Python script into a modern React application, allowing for real-time generation and exploration of star winding patterns directly in the browser.

## Features

- **Interactive Control Panel:** Generate patterns based on custom point counts.
- **Real-time Visualization:** View star patterns on an HTML5 Canvas.
- **Technical Data:** Displays winding patterns, step sizes, angles, and iteration counts.
- **Keyboard Navigation:** Quickly browse through generated patterns using arrow keys.
- **Responsive Design:** Optimized layout for desktop and mobile viewing.

## Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- npm (comes with Node.js)

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd starcoil-generator
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Running Locally

To start the development server:

```bash
npm run dev
```

This will start the application on `http://localhost:5000`.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, Shadcn/UI
- **Logic:** TypeScript (ported from Python)
- **Routing:** Wouter
- **State Management:** React Query

## License

MIT
