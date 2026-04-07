# 📚 Book Finder

A modern, responsive book search application with smooth animations and an elegant UI. Search for books, browse by category, manage favorites, and explore detailed book information powered by the Open Library API.
 
---

## ✨ Features

### Core Functionality
- **Smart Search**: Real-time book search with debounced input (500ms delay)
- **Recent Searches**: Auto-saved last 5 searches with quick access chips
- **Advanced Filters**: Filter by author, publication year range, language, and cover availability
- **Category Browse**: Explore 9 curated categories (Fiction, Science, History, Technology, Art, Biography, Children, Fantasy, Mystery)
- **Favorites System**: Save and manage your favorite books with local storage persistence
- **Book Details**: View comprehensive book information including description, subjects, and publication details
- **Author Pages**: Explore author biographies and their complete works

### UI/UX Enhancements
- **Lottie Animations**: Beautiful animated loader for page transitions and data loading
- **Motion Effects**: Smooth animations powered by Motion (Framer Motion) throughout the app
- **Browse Dropdown**: Elegant category navigation with icons and smooth transitions
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Accessibility**: ARIA labels, keyboard navigation, focus management, and screen reader support

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
cd BookFinder

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000` with hot-reload enabled.

---

## 🛠️ Tech Stack

### Core Technologies
- **React 19.2.0**: Modern React with hooks and concurrent features
- **React Router DOM 6.30.1**: Client-side routing and navigation
- **Axios 1.12.2**: HTTP client for API requests

### Animation Libraries
- **Motion 12.23.24**: Smooth, performant animations (Framer Motion)
- **@lottiefiles/dotlottie-react 0.17.6**: High-quality Lottie animations for loaders

### Styling
- **Custom CSS**: Hand-crafted styles with CSS variables for theming
- **Tailwind CSS 4.1.16**: Utility-first CSS framework (dev dependency)

### Testing
- **@testing-library/react 16.3.0**: React component testing
- **@testing-library/jest-dom 6.9.1**: Custom Jest matchers
- **@testing-library/user-event 13.5.0**: User interaction simulation

### Build Tools
- **React Scripts 5.0.1**: Create React App tooling
- **Web Vitals 2.1.4**: Performance metrics

---

## 📁 Project Structure

```
book-finder/
├── public/
│   ├── index.html          # HTML template
│   ├── manifest.json       # PWA manifest
│   └── robots.txt          # SEO robots file
├── src/
│   ├── components/
│   │   ├── BookCard.jsx         # Individual book card with animations
│   │   ├── BookList.jsx         # Grid layout for book cards
│   │   ├── BrowseDropdown.jsx   # Category navigation dropdown
│   │   ├── Header.jsx           # App header with theme toggle
│   │   ├── Modal.jsx            # Accessible modal with focus trap
│   │   ├── PageLoader.jsx       # Full-page Lottie loader
│   │   ├── SearchBar.jsx        # Search input with debounce
│   │   └── Spinner.jsx          # Inline Lottie spinner
│   ├── context/
│   │   ├── FavoritesContext.jsx # Favorites state management
│   │   └── SearchContext.jsx    # Search, filters, theme state
│   ├── hooks/
│   │   └── useBooks.js          # Custom hook for book data fetching
│   ├── pages/
│   │   ├── Author.jsx           # Author biography and works
│   │   ├── BookDetails.jsx      # Detailed book information
│   │   ├── Category.jsx         # Category-filtered book list
│   │   ├── Favorites.jsx        # Saved favorite books
│   │   └── Home.jsx             # Main search page
│   ├── App.jsx             # App root with routing
│   ├── index.css           # Tailwind directives
│   ├── index.js            # React entry point
│   └── style.css           # Custom styles and animations
├── package.json
└── README.md
```

---

## 🎨 Key Features Explained

### 1. Search System
**Component**: `SearchBar.jsx`
- **Debounced Input**: 500ms delay prevents excessive API calls
- **Recent Searches**: Stores last 5 searches in localStorage
- **Dual Search Modes**: 
  - Immediate: Button click triggers instant search
  - Debounced: Auto-search after 500ms of typing inactivity

### 2. Advanced Filtering
**Component**: `Home.jsx` (FiltersSection)
- **Cover Filter**: Show only books with cover images
- **Author Filter**: Search by author name
- **Year Range**: Filter by publication year (from/to)
- **Language**: Filter by language (English, Hindi, Spanish, French, German, Italian)
- **Sort**: Sort by publication year (ascending/descending)
- **Active Chips**: Visual indicators for active filters with quick removal

### 3. Browse Dropdown
**Component**: `BrowseDropdown.jsx`
- **Category Icons**: Each category has a unique emoji icon
- **Smooth Animations**: Staggered entrance animations for menu items
- **Backdrop Click**: Close dropdown by clicking outside
- **Mobile Optimized**: Bottom sheet on mobile, dropdown on desktop

### 4. Favorites System
**Context**: `FavoritesContext.jsx`
- **Local Storage**: Favorites persist across sessions
- **Quick Toggle**: Star/unstar books from any page
- **Minimal Storage**: Only stores essential book data

### 5. Loading States
**Components**: `PageLoader.jsx`, `Spinner.jsx`
- **Initial Load**: 1.5s Lottie animation on app start
- **Route Transitions**: 800ms loader between page navigations
- **Data Fetching**: Inline spinner for API requests
- **Custom Lottie**: Uses custom book-themed Lottie animation

### 6. Theme System
**Context**: `SearchContext.jsx`
- **Dark/Light Mode**: Toggle via header button
- **Persistent**: Saves preference to localStorage
- **CSS Variables**: Theme colors defined in `:root` and `html.dark`
- **Smooth Transition**: 300ms transition between themes

### 7. Responsive Design
**Media Queries**: `style.css`
- **Desktop** (>1024px): Full layout with optimal spacing
- **Tablet** (768px-1024px): Adjusted grid and navigation
- **Mobile** (<640px): Single column, bottom sheet navigation, touch-optimized

---

## 🔌 API Integration

### Open Library API
All data is fetched from the free Open Library API:

**Search Endpoint**:
```
GET https://openlibrary.org/search.json?title={query}&limit=50
```

**Book Details**:
```
GET https://openlibrary.org/works/{id}.json
```

**Author Details**:
```
GET https://openlibrary.org/authors/{id}.json
GET https://openlibrary.org/authors/{id}/works.json?limit=20
```

**Category/Subject**:
```
GET https://openlibrary.org/subjects/{category}.json?limit=50
```

**Cover Images**:
```
https://covers.openlibrary.org/b/id/{cover_id}-M.jpg
```

**No API Key Required** – All endpoints are free and open.

---

## 🎭 Animation Details

### Motion (Framer Motion) Usage
- **Page Transitions**: Fade in/out with slide effects
- **Card Animations**: Lift on hover, staggered grid entrance
- **Button Interactions**: Scale and translate on hover/tap
- **Modal**: Scale-in entrance with backdrop fade
- **Filters**: Smooth height animation for expand/collapse

### Lottie Animations
- **PageLoader**: Full-screen animated loader
- **Spinner**: Inline loading indicator
- **Source**: Custom Lottie files from LottieFiles

---

## ⚙️ Configuration

### Environment Variables
No environment variables required. All configuration is in code.

### Customization

**Colors** (style.css):
```css
:root {
  --bg: #f8fafc;
  --text: #0f172a;
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --card: #ffffff;
  --border: #e2e8f0;
}
```

**Animation Timing** (various components):
- Page loader: 1500ms
- Route change: 800ms
- Debounce delay: 500ms

**Result Limits**:
- Search: 50 results
- Category: 50 books
- Author works: 20 books
- Recent searches: 5 items

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Mobile browsers fully supported.

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` directory.

### Deployment Platforms
- **Vercel**: Auto-deploy from GitHub
- **Netlify**: Drag-and-drop `build/` folder
- **GitHub Pages**: Use `gh-pages` package

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Windows PowerShell
$env:PORT=3001; npm start
```

### No Results Found
- Try simpler search terms
- Check spelling
- Try different filters

### Images Not Loading
- Some books lack cover images
- Placeholder image shown automatically

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgements

- **Open Library**: Free book data and covers API
- **LottieFiles**: Animation resources
- **Framer**: Motion animation library
- **React Team**: Amazing framework

---

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review troubleshooting section
3. Open an issue on GitHub

---

**Built with ❤️ using React and Open Library API**
