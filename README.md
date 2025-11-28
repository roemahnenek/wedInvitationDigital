This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Quick Vercel deploy steps

1. Push your repository to GitHub (or connect your Git provider) and import the project into Vercel.
2. In Vercel Project Settings → Environment Variables, add the following variables:
	- `MONGODB_URI` — your MongoDB connection string
	- `JWT_SECRET` — secure random string used for signing JWTs
	Optionally set `NODE_ENV=production` (Vercel sets this automatically for production deployments).
3. Use the default Build Command (`npm run build`) and Output Directory (handled by Next.js).
4. Deploy. Vercel will run `npm install` and `npm run build` automatically.

Notes:
- This project uses Next.js app router and serverless API routes — Vercel supports these out of the box.
- If your build fails due to client-hook prerendering (useSearchParams/useRouter), pages inside `src/app` are configured to render dynamically where needed.

Local development:
- Copy `.env.example` to `.env.local` and fill values for local testing.

