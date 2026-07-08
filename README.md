<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Fiction Airline Reservation System

A modern airline reservation platform for searching flights, booking tickets, processing payments, and managing passenger itineraries. Built with React, TypeScript, Node.js/Express, and powered by Gemini AI.

View your app in AI Studio: https://ai.studio/apps/34e2967c-0d3d-46ca-a243-5a1608e0d28e

## Features

- **Flight Search**: Search for flights, filter results, and view available fare options
- **Booking Management**: Create reservations, select seats, and complete checkout
- **Customer Account**: Manage profiles, booking history, and traveler details
- **Payment Processing**: Secure payment authorization and capture
- **Notifications**: Email and SMS confirmations and travel alerts

## Architecture

This system follows the C4 model architecture with the following components:

### Actors
- **Customer**: Passengers who search for flights, book tickets, and manage bookings
- **Travel Agent**: Books flights and manages travel on behalf of customers
- **Airline Staff**: Manages schedules, inventory, and passenger support

### Core Containers
- **Web Application** (React, TypeScript): Browser-based interface for customers and agents
- **Mobile App** (Flutter): Mobile interface for customers
- **Public API** (Node.js/Express): REST/GraphQL API used by clients
- **Booking Service** (Spring Boot): Handles booking workflows and seat allocation
- **Flight Search Service** (Spring Boot): Provides search, pricing, and availability
- **Inventory Management Service** (Spring Boot): Maintains seat inventory
- **Payment Processing Service** (Spring Boot): Processes payments
- **Notification Service** (Node.js): Sends email and SMS notifications
- **Reservation Database** (PostgreSQL): Stores reservations, payments, and inventory

### External Systems
- **Payment Provider**: External payment service for authorization
- **Flight Data Service**: External system providing flight schedules and fares
- **Email/SMS Notification Service**: External service for sending notifications

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your GEMINI_API_KEY
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server using tsx |
| `npm run build` | Build for production (Vite + esbuild) |
| `npm run start` | Start production server |
| `npm run clean` | Remove dist folder and server.js |
| `npm run lint` | Run TypeScript type checking |

## Project Structure

```
├── src/                 # Source code
├── server.ts            # Express server entry point
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
├── .env.example         # Environment variables template
└── fiction-airline-reservation.dsl  # C4 architecture model
```

## Technologies

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Motion, Lucide React
- **Backend**: Node.js, Express, TypeScript
- **AI**: Google Gemini AI (@google/genai)
- **Build Tools**: Vite, esbuild, tsx

## License

Private - All rights reserved
