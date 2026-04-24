# Ro0m

Ro0m is an authenticated video meeting app built with Next.js App Router, Clerk, and Stream Video.
Users can create instant meetings, schedule upcoming calls, join via links, and review previous calls and recordings.

## Features

- Clerk-based authentication (sign in and sign up flows)
- Instant meetings, scheduled meetings, and join-by-link
- Personal room generation with shareable invite links
- Upcoming and previous call views with call-state categorization
- Recordings page for completed meeting sessions
- Keyboard shortcuts, command palette, and accessibility-oriented controls
- Responsive UI built with Tailwind CSS and shadcn-style primitives

## Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Clerk for authentication
- Stream Video SDK (`@stream-io/video-react-sdk` and server token generation)
- Tailwind CSS + Radix UI primitives

## Prerequisites

- Node.js 18+
- npm (or another compatible package manager)
- A Clerk project
- A Stream Video project/API credentials

## Environment Variables

Create a `.env.local` file in the project root with:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stream Video
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key

# Optional, used for invite links, robots, and sitemap metadata
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev    # start development server
npm run build  # production build
npm run start  # run production build
npm run lint   # lint the codebase
```

## Deployment

Deploy to Vercel (or any Node-compatible host) and configure the same environment variables from `.env.local`.

## License

This project is licensed under the MIT License.

