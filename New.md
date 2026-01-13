Agri-Bot / Agri-Education Platform
Technical Design & Implementation Document (HTML • CSS • JavaScript Only)

1. Project Summary
Project Name

Agri-Bot

Stack Constraint

✔ HTML5
✔ CSS3
✔ Vanilla JavaScript
✖ No Database
✖ No Backend
✖ No Frameworks

Goal

To build a fully functional front-end prototype of an agricultural education and assistance platform that:

Educates farmers

Demonstrates AI chatbot UX

Provides farming resources

Can later be connected to APIs and databases without redesign

2. Core Design Philosophy

Offline-friendly

Low bandwidth optimized

Readable for rural users

Modular structure for future backend

Clean, minimal UI

3. Visual Theme & Branding
Theme Name

EarthTech Green

Color Palette
Purpose	Color
Primary	#2E7D32 (Leaf Green)
Secondary	#F9A825 (Harvest Yellow)
Background	#F5F7F4
Text Primary	#1B1B1B
Accent	#6D4C41 (Soil Brown)
Typography

Headings: Poppins

Body: Roboto

Font Size:

Heading: 28–36px

Subheading: 18–22px

Body: 15–16px

4. Folder Structure (No Backend)
agri-bot/
│
├── index.html
├── about.html
├── bot.html
├── sustainable.html
├── resources.html
├── marketplace.html
├── education.html
├── contact.html
│
├── css/
│   ├── style.css
│   └── responsive.css
│
├── js/
│   ├── main.js
│   ├── chatbot.js
│   ├── marketplace.js
│   └── education.js
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── videos/
│
└── data/
    ├── faq.json
    ├── products.json
    └── courses.json


✔ data/ folder simulates database using JSON
✔ Easy backend replacement later

5. Page-wise Technical Breakdown
5.1 Home Page (index.html)
Purpose

Entry point and navigation hub.

UI Components

Fixed navigation bar

Hero section with CTA

Feature cards

Platform overview

Footer

JS Features

Smooth scroll

CTA button routing

Mobile navbar toggle

5.2 About Us (about.html)
UI Components

Mission section

Vision cards

Timeline section

Team cards

CSS Focus

Flexbox layout

Card hover animations

5.3 Agri-Bot Page (bot.html)
Purpose

Chatbot UI demonstration.

UI Components

Chat window

Message bubbles

Predefined question buttons

Input box

JS Logic (chatbot.js)

Keyword-based response engine

FAQ loading from faq.json

Typing animation

Auto-scroll

✔ No AI API yet
✔ Ready for API plug-in later

5.4 Sustainable Farming (sustainable.html)
UI Components

Accordion sections

Step-by-step guides

Embedded videos

Download buttons

JS Features

Expand/collapse logic

Progress tracker (localStorage)

5.5 Farm Resources & Tools (resources.html)
Features

Weather UI (mock data)

Crop calendar

Equipment list

Government schemes cards

JS Logic

JSON-based data rendering

Filter & search

Location-based placeholder

5.6 Marketplace (marketplace.html)
Purpose

Static e-commerce prototype.

Features

Product cards

Category filter

Search bar

Cart UI (localStorage)

JS Logic (marketplace.js)

Load products from products.json

Cart add/remove

Price calculation

✔ No payment gateway
✔ Cart persists via browser storage

5.7 Educational Resources (education.html)
Features

Course cards

Video embeds

Quiz modal

Certificate preview

JS Logic

Load courses from JSON

Quiz scoring

Progress saving (localStorage)

5.8 Contact & Community (contact.html)
Features

Contact form

FAQ section

Community discussion UI (static)

Newsletter form

JS Features

Form validation

Success messages

Dummy submission handling

6. CSS Architecture
CSS Rules

BEM-style naming

Global variables for theme

Mobile-first approach

:root {
  --primary: #2E7D32;
  --secondary: #F9A825;
  --bg: #F5F7F4;
  --text: #1B1B1B;
}

7. JavaScript Standards

Modular JS files

No inline JS

Event delegation

Reusable utility functions

8. Responsiveness

CSS Grid + Flexbox

Breakpoints:

Mobile: <768px

Tablet: <1024px

Desktop: >1024px

Touch-friendly buttons

9. Accessibility

Semantic HTML

ARIA labels

High contrast text

Keyboard navigation

10. Performance Optimization

Minified assets

Lazy loaded images

Lightweight fonts

No heavy animations

11. Future Upgrade Path
Feature	Status
Database	Planned
AI API	Planned
Login System	Planned
Mobile App	Planned
PWA	Planned
12. Deployment

Works on:

GitHub Pages

Netlify

Local server

No server configuration needed

13. Team Guidelines

One page = one JS file

No hard-coded data

Commented code

Reusable components

14. Final Notes

This document defines a production-ready front-end architecture using only HTML, CSS, and JavaScript, designed to scale cleanly into a full-stack agricultural platform.