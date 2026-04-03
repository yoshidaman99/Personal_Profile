# Jerel Yoshida — AI Avatar Profile

A personal AI-powered chat interface that lets visitors interact with Jerel Yoshida's animated avatar. Built with Next.js, Vercel AI SDK, and Framer Motion.

## Features

- Animated SVG avatar with breathing, blinking, thinking, and speaking states
- Real-time streaming chat powered by Groq (Llama 3.3 70B) or OpenAI (GPT-4o-mini)
- Markdown-formatted responses with syntax highlighting
- Floating suggestion chips for quick conversation starters
- Pure black dark theme with neon cyan accents
- Fully responsive design

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Option A: Groq (recommended — fast & free tier)
GROQ_API_KEY=your_groq_api_key_here

# Option B: OpenAI (fallback)
OPENAI_API_KEY=your_openai_api_key_here
```

Get a Groq API key at [console.groq.com](https://console.groq.com)

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add `GROQ_API_KEY` or `OPENAI_API_KEY` in Environment Variables
4. Deploy

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **AI:** Vercel AI SDK + Groq / OpenAI
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Font:** Manrope
- **Styling:** CSS custom properties

## Contact

- **Email:** jerel.r.yoshida@gmail.com
- **Book a call:** [calendly.com](https://calendly.com/yoshidaman12345/30min)
