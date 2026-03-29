# RPA Specialist Portfolio

Fullstack portfolio built with **Flask** (backend) + **HTML/CSS/JS** (frontend).  
Supports **English** and **Portuguese (BR)** with instant language switching.

## Project Structure

```
portfolio/
├── app.py                  # Flask app + API routes
├── requirements.txt
├── vercel.json             # Vercel deployment configuration
├── data/                   # JSON data separated by language & section
│   ├── en/
│   └── pt/
├── templates/
│   └── index.html          # Single-page shell
└── static/
    ├── css/
    │   └── style.css       # All styles 
## Quickstart

```bash
# 1. Create & activate a virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the dev server
python app.py
```

Open **http://localhost:5000** in your browser.

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

| Method | Route | Description |
|---|---|---|
| GET | `/` | Serves the SPA shell |
| GET | `/api/portfolio/en` | Full EN data |
| GET | `/api/portfolio/pt` | Full PT data |
| GET | `/api/projects/en` | Projects list only (EN) |
| GET | `/api/projects/pt` | Projects list only (PT) |

## Production Deployment

For production replace `app.run(debug=True)` with a WSGI server:

```bash
pip install gunicorn
gunicorn app:app -w 4 -b 0.0.0.0:8000
```