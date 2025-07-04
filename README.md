# Manushya.ai Dashboard

A production-ready, full-featured UI for **Manushya.ai**, a secure identity + memory infrastructure system for autonomous agents. This UI connects to the existing FastAPI backend and allows authenticated users to manage identities, search agent memories, and create/inspect policies.

## Features

- 🔐 **JWT-based Authentication** - Secure login via `/v1/identity` endpoint
- 👥 **Identity Management** - Create, view, and copy identity tokens
- 🧠 **Memory Search & Management** - Search, create, and soft-delete agent memories
- 📋 **Policy Management** - Create and view policies with JSON editor
- 📊 **Audit Logs** - View system activity and memory diffs
- 🎨 **Dark Theme** - Beautiful dark UI with teal accents
- 📱 **Responsive Design** - Mobile-friendly with collapsible sidebar
- ⚡ **Real-time Updates** - Live data with smooth animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Forms**: React Hook Form + Zod validation
- **State**: React Context for auth
- **API**: Axios with typed wrappers
- **Animation**: Framer Motion
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- FastAPI backend running (default: `http://localhost:8000`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chehra
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your configuration
```

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
# API Base URL - Point to your FastAPI backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Optional: Enable debug logging (true/false)
NEXT_PUBLIC_DEBUG=false

# Optional: Custom app title
NEXT_PUBLIC_APP_TITLE=Manushya.ai
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

The application connects to the following FastAPI endpoints:

- `POST /v1/identity` - Login/Create identity
- `GET /v1/identity` - List identities
- `POST /v1/memory/search` - Search memories
- `POST /v1/memory` - Create memory
- `DELETE /v1/memory/{id}` - Soft-delete memory
- `GET /v1/policy` - List policies
- `POST /v1/policy` - Create policy
- `GET /v1/audit` - Get audit logs (optional)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Authentication page
│   ├── dashboard/         # Main dashboard
│   ├── identities/        # Identity management
│   ├── memories/          # Memory search & management
│   ├── policies/          # Policy management
│   └── logs/              # Audit logs
├── components/            # Reusable UI components
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── Topbar.tsx         # Header with user info
│   ├── IdentityForm.tsx   # Create identity form
│   ├── MemoryCard.tsx     # Memory display card
│   └── PolicyEditor.tsx   # Policy JSON editor
├── lib/                   # Utilities and API
│   ├── api.ts            # Typed API client
│   ├── auth.ts           # Token management
│   ├── types.ts          # TypeScript types
│   └── useAuth.tsx       # Authentication hook
└── styles/               # Global styles
    └── globals.css       # Tailwind imports
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
