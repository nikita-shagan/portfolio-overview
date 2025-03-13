# Portfolio Overview

## Description
Portfolio Overview is a React-based web application for managing and tracking a cryptocurrency portfolio with real-time price updates. It utilizes WebSockets for live data streaming, Redux Toolkit for state management, and IndexedDB for local persistence.

## Features
- **Asset List**: Displays portfolio assets with key details.
- **Real-time Price Updates**: WebSocket integration with Binance API.
- **Asset Management**: Add and remove assets.
- **Local Storage**: Data persistence using IndexedDB.
- **Performance Optimization**: Virtualized list for handling large asset collections.
- **Responsive Design**: Adaptive UI for various screen sizes.

## Tech Stack
- **Frontend**: Next.js (React, TypeScript)
- **State Management**: Redux Toolkit
- **WebSocket**: Binance API via `socket.io-client`
- **Storage**: IndexedDB via `idb`
- **UI Libraries**: `classnames`, `react-window`

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/nikita-shagan/portfolio-overview.git
   cd portfolio-overview
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
- Open the app in a browser (`http://localhost:3000`).
- Add assets using the provided form.
- Prices update in real-time via WebSocket.
- Remove assets by clicking on them.
- Data is stored locally and persists across reloads.

## Author
Nikita Shagan
