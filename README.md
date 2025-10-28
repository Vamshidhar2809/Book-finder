📚 Book Finder

Book Finder is a modern, responsive web application built using React.js that allows users to search for millions of books from the Open Library API.
It’s designed for Alex, a college student who wants to quickly find books for study or leisure — by title, author, or subject — with an elegant, user-friendly interface.

🚀 Features

✅ Search by Title, Author, or ISBN using Open Library’s public API
✅ Sort Results by relevance or year
✅ Predefined Quick Searches for popular topics (e.g., “Harry Potter”, “Machine Learning”)
✅ Responsive Design — optimized for both desktop and mobile
✅ Error Handling for empty results or network issues
✅ Modern UI with glassmorphism, clean typography, and book-themed background
✅ Accessible and Fast — no login, no dependencies, instant results

🛠️ Tech Stack
Category	Technology Used
Frontend Framework	React.js (Create React App)
Styling	CSS3 (Glassmorphism with background blur and gradient)
Data Source	Open Library Search API

State Management	React Hooks (useState, useEffect)
Build Tool	npm / CRA (no Vite)
⚙️ Installation & Setup

Clone the repository:

git clone https://github.com/Vamshidhar2809/Book-finder.git


Navigate into the project folder:

cd book-finder


Install dependencies:

npm install


Start the development server:

npm start


Open in your browser:

http://localhost:3000

🌐 API Reference

Base URL:

https://openlibrary.org/search.json?title={bookTitle}


Example:

https://openlibrary.org/search.json?title=harry%20potter


Response includes:

Title

Author

First Publish Year

Cover Image ID (for displaying book cover)

💡 How It Works

User enters a book title, author, or keyword in the search bar.

React fetches data from Open Library API using fetch().

Results are displayed dynamically with cover images, author names, and publication year.

Users can switch between sort modes (Relevance / Year).

If no books are found, a friendly message is shown instead of a blank screen.

🎨 UI Preview

The design features:

Soft blurred glass container for focus

Book library background image

Highlighted yellow-accented buttons for search and filters

Subtle shadows and rounded corners for modern feel

🧠 Future Improvements

Add pagination or “Load more” button

Implement book detail modal (description, rating, preview)

Allow saving favorites using localStorage

Integrate dark/light mode toggle

🧪 Testing

Tested on Chrome, Edge, and Firefox

Responsive across 320px to 1440px viewports

Tested for empty input, network error, and invalid searches

👨‍💻 Developed By

A K Vamshidhar Reddy
Passionate about Frontend, Full-Stack Development, and UI Design.
Built this project as part of a technical assessment to demonstrate clean code, creative design, and problem-solving using AI guidance.

🤖 AI Assistance Acknowledgment

Some parts of the project were refined with the help of ChatGPT (OpenAI) — for design ideas, error handling, and UI improvements — while the implementation and logic were coded manually.
