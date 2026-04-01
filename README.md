# RPA Specialist Portfolio

A fast, lightweight **static portfolio** built with purely **HTML, CSS, and Vanilla JavaScript**.  
Supports **English** and **Portuguese (BR)** with instant language switching.

## Project Structure

```text
portfolio/
├── index.html              # Main HTML entry point (Single-page shell)
├── data/                   # JSON data separated by language & section
│   ├── en/
│   └── pt/
└── static/
    ├── css/
    │   └── style.css       # All styles 
    ├── js/
    │   └── main.js         # Logic to fetch JSON and render the page
    └── images/             # Profile pictures, project assets, etc.
```

## Quickstart

Because this is a pure static site, you have a few simple options to view it locally:

**Option 1: Live Server (Recommended)**  
If you use VS Code, install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension. Right-click on `index.html` and select **"Open with Live Server"**.

**Option 2: Simple Local HTTP Server**  
Modern browsers restrict fetching local JSON files via the `file://` protocol due to CORS policies. You can quickly spin up an HTTP server using Python:

```bash
# Run this in the project root directory
python -m http.server 5000
```
Then, open **http://localhost:5000** in your browser.

## How to Personalise

All content is structured into JSON files within the `data/` folder, neatly separated by language (`en`/`pt`) and sections:

- `data/*/hero.json`: Your name, tagline, and call-to-actions.
- `data/*/about.json`: Bio, stats, skills, certifications, and contact info.
- `data/*/projects.json`: Array of your portfolio projects.
- `data/*/nav.json`: Translation strings for the navigation menu.

Just edit these JSON files, drop your images/CV into `static/`, and your portfolio will reflect the changes automatically!

## Vibe Coding & Open Source ✨

This project was built from scratch via **vibe coding** (AI-assisted development) and is completely **Open Source**. 
You are free to fork, clone, modify, and host this portfolio template for your own personal or professional use, without any restrictions. Have fun!

## Production Deployment

This portfolio requires absolutely no backend, making it **100% free** and extremely fast to host.

**GitHub Pages (Recommended & Free):**
1. Push this project code to a GitHub repository.
2. Go to your repository's **Settings > Pages**.
3. Choose the **main** branch as the source and click Save.
4. Your portfolio will be live in a couple of minutes!

You can also easily deploy this to [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or [Cloudflare Pages](https://pages.cloudflare.com/) by simply dragging and dropping your project folder into their dashboard or connecting your GitHub repo.