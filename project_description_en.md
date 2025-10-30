# FF14 Outfit Collection Gallery

## Overview
A static personal website to archive and showcase custom character outfit combinations created in Final Fantasy XIV. The site functions as a digital wardrobe, presenting outfit photos and their corresponding item lists without using any backend or database — all data are stored as local JSON files and static assets.

## Goals
- Provide a clean, responsive gallery to browse outfits.
- Store outfit metadata (title, description, tags, items) and images locally.
- Keep the project static for easy hosting (GitHub Pages, Netlify, Vercel).
- Use Vue + Tailwind CSS for a modern, lightweight frontend.

## Key Features
- Grid/list gallery of outfits with thumbnails.
- Outfit detail view: images, itemized equipment by slot, tags, and notes.
- Local JSON data source (e.g., src/data/outfits.json or public/data/outfits.json).
- Easy-to-edit data format for adding or updating outfits.
- Responsive design, image lazy-loading, and thumbnails.
- Optional client-side filtering and search (by job, tag, slot).

## Data Model (example)
Outfits stored as an array of objects in a JSON file:

{
  "id": "unique-id",
  "title": "Outfit Name",
  "description": "Short description or theme",
  "tags": ["DRK", "Glamour", "Winter"],
  "images": ["images/outfit-1-1.jpg", "images/outfit-1-2.jpg"],
  "items": [
    { "slot": "Head", "name": "Helm Name", "source": "Crafted / Drop / Vendor" },
    { "slot": "Body", "name": "Armor Name", "source": "Armor Source" }
  ],
  "createdAt": "2025-10-21",
  "notes": "Optional notes about dye or glamours"
}

## Suggested Project Structure
ff14-outfit-gallery/
├─ public/
│  ├─ images/            # outfit images
│  └─ data/outfits.json  # static data (or put under src/data/)
├─ src/
│  ├─ main.ts
│  ├─ App.vue
│  ├─ components/        # OutfitCard.vue, OutfitList.vue, OutfitDetail.vue
│  └─ styles/tailwind.css
├─ index.html
├─ package.json
├─ vite.config.ts
└─ tailwind.config.js

## How to Add / Update an Outfit
1. Put image files under public/images/ (or a chosen static folder).  
2. Edit public/data/outfits.json and add a new outfit object following the data model.  
3. Reload the site — changes appear immediately in dev mode or after redeploy for static hosts.

## Build & Deployment
- Dev: npm install && npm run dev  
- Build: npm run build (outputs static assets in dist/)  
- Host: GitHub Pages, Netlify, Vercel, or any static file host.

## Notes
- No backend or database is used; all content is static.  
- Keep image sizes optimized for web (use thumbnails and lazy-loading).  
- Consider providing an export/import JSON for backups.

## License
Choose a license (e.g., MIT) if you plan to publish the repo.