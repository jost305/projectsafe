<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1_cnyf00THaum9QOq_gcnO9EY5WTNsvQB

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Auth / Privy setup

- Add your Privy credentials to the project `.env` for local development.
- The repo must NOT contain secrets. Add the Privy secret only to your local environment or a secure secrets manager.

Example `.env` entries:

```dotenv
PRIVY_APP_ID=cm8ki21cg00q7tcgdnn0emd1t
PRIVY_SECRET=your-privy-secret-here
```

- `PRIVY_APP_ID` can be used in the browser (public). `PRIVY_SECRET` is sensitive and must remain server-only.
- Restart the dev server after changing `.env`.

If you'd like, I can add a simple `Profile` component that shows the logged-in user's name/email using `@privy-io/react-auth`.
