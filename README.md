# Bartending Academy

An interactive educational web application for learning bartending, featuring flashcards, quizzes, and engaging games to master mixology skills.

![Bartending Academy](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055)

## Features

### Interactive Learning
- **Flashcards**: Study drink recipes, bartending techniques, and terminology with flip animations
- **Quizzes**: Test your knowledge with timed, multiple-choice quizzes
- **Games**: Practice measurements and ingredient matching with fun, interactive games
- **User-Generated Content**: Create and manage your own custom flashcards

### Gamification
- **Experience Points**: Earn XP for studying and completing challenges
- **Level System**: Progress through levels as you learn
- **Achievements**: Unlock badges for reaching milestones
- **Progress Tracking**: Monitor your performance across all learning activities

### Modern UI/UX
- Smooth animations with Framer Motion
- Responsive design for mobile and desktop
- Accessible keyboard navigation
- Beautiful gradient backgrounds and card designs

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Data Storage**: Local Storage (browser-based)

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd bartending_quizzer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
bartending_quizzer/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page
│   ├── flashcards/          # Flashcards page
│   ├── quizzes/             # Quizzes page
│   ├── games/               # Games page
│   ├── create/              # Create content page
│   ├── progress/            # Progress tracking page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Badge.tsx
│   ├── flashcards/          # Flashcard components
│   │   ├── FlashcardComponent.tsx
│   │   ├── FlashcardStudySession.tsx
│   │   └── AddFlashcardForm.tsx
│   ├── quiz/                # Quiz components
│   │   ├── QuizTaker.tsx
│   │   └── QuizResults.tsx
│   ├── games/               # Game components
│   │   ├── MeasurementGame.tsx
│   │   └── IngredientMatchGame.tsx
│   └── layout/              # Layout components
│       └── Navigation.tsx
├── lib/                     # Utility functions
│   └── storage.ts          # Local storage helpers
├── types/                   # TypeScript type definitions
│   └── index.ts
├── data/                    # Initial seed data
│   └── initialData.ts
└── public/                  # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features Breakdown

### Flashcards System
- Flip animations for card interactions
- Category filtering (recipes, techniques, terminology, measurements, ingredients)
- Progress tracking with review counts and accuracy
- Spaced repetition support with difficulty levels
- Keyboard shortcuts for navigation

### Quiz System
- Multiple question types (multiple-choice, true/false)
- Timed challenges with countdown timer
- Instant feedback with explanations
- Detailed results with question review
- Passing score requirements

### Interactive Games

**Measurement Master**
- Test knowledge of bartending measurements
- Timed challenges for speed and accuracy
- Multiple conversion types (oz, ml, dashes, etc.)
- Point scoring system

**Ingredient Match**
- Match cocktails with correct ingredients
- Multiple ingredient selection
- Immediate feedback on accuracy
- Classic cocktail focus

### User-Generated Content
- Create custom flashcards
- Choose categories and difficulty levels
- Add tags for organization
- CRUD operations with local storage

### Progress Tracking
- Experience points and level system
- Performance analytics across all activities
- Achievement badges
- Visual progress indicators

## Data Storage

The application uses browser Local Storage for data persistence. All data is stored locally on the user's device.

### Stored Data Types:
- Flashcards (user-created and pre-loaded)
- Quiz results
- Game sessions
- User progress and stats

### Data Management Functions:
Located in `lib/storage.ts`:
- `getFlashcards()` / `saveFlashcard()`
- `getQuizzes()` / `saveQuiz()`
- `getQuizResults()` / `saveQuizResult()`
- `getGameSessions()` / `saveGameSession()`
- `getUserProgress()` / `updateUserProgress()`

## Customization

### Adding New Flashcards
1. Navigate to the "Create" page
2. Fill in the form with question, answer, category, and tags
3. Set the difficulty level
4. Click "Create Flashcard"

### Adding New Quizzes
Edit `data/initialData.ts` and add to the `initialQuizzes` array:

```typescript
{
  id: 'unique-id',
  title: 'Quiz Title',
  description: 'Quiz description',
  category: 'category-name',
  timeLimit: 300, // seconds
  passingScore: 70, // percentage
  questions: [
    // Add question objects
  ]
}
```

### Customizing Colors
Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  primary: {
    // Your primary color shades
  },
  accent: {
    // Your accent color shades
  }
}
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Next.js automatic code splitting
- Lazy loading of game components
- Optimized animations (60fps target)
- Efficient local storage operations
- Responsive images and assets

## Accessibility Features

- Keyboard navigation support
- ARIA labels on interactive elements
- Semantic HTML structure
- Focus indicators
- Screen reader compatible

## Future Enhancements

Potential features for future development:
- User authentication and cloud sync
- Social features (sharing scores, challenges)
- More game types (speed pour, recipe builder)
- Mobile app version
- Multiplayer quiz competitions
- Advanced spaced repetition algorithms
- Audio pronunciation guides
- Video tutorials integration

## Contributing

This is a learning platform. Feel free to fork and customize for your needs!

## License

MIT License - Feel free to use this project for personal or educational purposes.

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.

---

Built with ❤️ for bartending enthusiasts and aspiring mixologists.
