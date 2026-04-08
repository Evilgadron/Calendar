# 🗓 The Wall Calendar 

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer](https://img.shields.io/badge/Framer-black?style=for-the-badge&logo=framer&logoColor=blue)

A highly polished, interactive wall calendar component built to translate a static design concept into a tactile, "God-made" web experience. This project goes beyond standard layouts by enforcing strict spatial constraints, hardware-accelerated animations, and a premium physical aesthetic.

### 🔗 Links
* **Live Demo:** [(https://calendar-nine-silk.vercel.app/)]
* **Video Walkthrough:** [Insert Loom/YouTube Link Here]

---

## 🛠 The Architecture & UX Decisions

Instead of a standard fluid layout that breaks when a user inputs too much text, this calendar is built like a **native desktop application**. 

1. **Strict Spatial Boundaries:** The UI is locked into a viewport-relative frame (`h-[90vh]`). If a user writes a 500-word note, the application doesn't stretch; instead, it uses localized, heavily-styled scrollbars. 
2. **Tactile Motion:** Using `framer-motion`'s `AnimatePresence` and custom direction variables, navigating between months visually "swipes" the days in the correct chronological direction, mimicking the physical turning of a calendar page.
3. **Glassmorphism Control Center:** Interactive elements layered over the hero image utilize deep backdrop blurs and high-contrast styling to ensure they remain legible regardless of how complex or bright the chosen image is.

---

## ✅ Core Requirements Met

* **Wall Calendar Aesthetic:** A 40/60 desktop split featuring a prominent visual anchor (the hero image) paired with a highly structured, minimalist date grid.
* **Smart Day Range Selector:** Users can click a start date and hover to see a real-time "ghost" preview of their selection before clicking to finalize the end date.
* **Integrated Notes Engine:** A dedicated, non-truncating itinerary panel. Users can add "Monthly Goals" or attach notes to specific multi-day ranges.
* **Flawless Responsiveness:** * **Desktop:** A sophisticated side-by-side locked layout.
  * **Mobile:** Gracefully collapses into a vertical stack (Hero -> Calendar -> Notes) while retaining internal scroll boundaries to ensure touch-screen usability.

---

## ✨ Creative Liberties & "Extra" Features

* **Custom Cover Uploads:** Users can dynamically swap the hero image using a local file upload to personalize their calendar.
* **Dark/Light Mode:** Full-spectrum theme switching that transitions background, text, and border opacities globally.
* **Persistent Storage:** The calendar seamlessly saves your notes, chosen theme, and hero image to `localStorage` to prevent data loss on refresh.
* **"Today" Aura:** The current day is automatically detected and highlighted with a pulsing indicator and high-contrast ring.
* **Year Quick-Jump:** Integrated dedicated Year/Month navigation controls to prevent users from having to click 12 times to change a year.

---

## 💻 Local Installation & Setup

This component is built to drop right into any React or Next.js environment.

**1. Clone the repository**
```bash
git clone [https://github.com/Evilgadron/calendar.git](https://github.com/Evilgadron/calendar.git)
cd calendar
```

**2. Install dependencies**
Make sure you have `date-fns`, `framer-motion`, and `lucide-react` installed alongside Tailwind CSS.
```bash
npm install date-fns framer-motion lucide-react
```

**3. Run the development server**
```bash
npm run dev
```

**4. View in Browser**
Open `http://localhost:3000` to interact with the calendar.
```
