# K&K Exports recreation

A React/Vite recreation of the public K&K Exports website, with the requested light-blue and white palette. Publicly delivered image assets were saved locally under `client/public/assets`.

## Pages

- Home, About Us, Private Labelling, Contact Us
- Product index plus Whole Spices, Ground Spices, Dals, Herbal Products, Millets, Jaggery, Tea & Coffee, Oils, Rice, Snacks, Coconut Products, Dehydrated Items, Biodegradable Cutleries, Commercial Restaurant Equipments, and Others

## Run

```bash
npm install
npm run dev
```

The client runs on `http://localhost:5173` and the API on `http://localhost:5000`.

## API

- `GET /api/health`
- `POST /api/contact`
- `POST /api/enquiries`

The server validates name, email, optional phone, and message, applies Helmet, CORS, and rate limiting. Enquiries are retained in memory; replace the `enquiries` array in `server/server.js` with the project's chosen database adapter when durable storage is required.

Copy `.env.example` to `.env` to configure the server port and allowed client origin.
