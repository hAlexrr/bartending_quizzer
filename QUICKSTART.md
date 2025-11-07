# Quick Start Guide - Bartending Academy

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Open Your Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## First Steps

### Explore the Platform
- **Home Page**: Overview of features and your current stats
- **Flashcards**: Study pre-loaded bartending knowledge
- **Quizzes**: Test yourself with timed quizzes
- **Games**: Practice with interactive games
- **Create**: Add your own custom flashcards
- **Progress**: Track your learning journey

### Try These Features First

1. **Study Flashcards**
   - Go to Flashcards page
   - Select a category (or study all)
   - Click "Start Study Session"
   - Click cards to flip them
   - Mark if you knew the answer

2. **Take a Quiz**
   - Navigate to Quizzes
   - Select "Bartending Basics"
   - Answer the questions
   - Review your results

3. **Play a Game**
   - Go to Games page
   - Try "Measurement Master"
   - Answer as quickly as possible
   - Beat your high score!

4. **Create Content**
   - Visit the Create page
   - Add your own flashcard
   - Use it in study sessions

## Tips for Best Experience

### Study Effectively
- Review flashcards daily for best retention
- Take quizzes after studying to reinforce learning
- Use games to make measurement practice fun
- Create custom cards for topics you find challenging

### Track Your Progress
- Check the Progress page regularly
- Aim to improve your accuracy scores
- Earn XP to level up
- Unlock achievements

### Customize Your Experience
- Filter flashcards by category
- Focus on difficult topics
- Create study sets for specific areas
- Mix different learning methods

## Keyboard Shortcuts

### Flashcard Study
- `Left Arrow`: Previous card
- `Right Arrow`: Next card
- `1`: Mark as "Didn't Know"
- `2`: Mark as "Got It!"

### Navigation
- Use standard browser navigation
- All interactive elements are keyboard accessible

## Troubleshooting

### Development Server Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port Already in Use
```bash
# Run on a different port
PORT=3001 npm run dev
```

### Browser Issues
- Clear browser cache
- Try in an incognito/private window
- Ensure JavaScript is enabled

## Production Build

To build for production:
```bash
npm run build
npm start
```

## Need Help?

- Check the main README.md for detailed documentation
- Review the component files for implementation details
- Inspect browser console for any errors
- Ensure all dependencies are installed correctly

## What's Included

- 10 pre-loaded flashcards covering:
  - Bartending terminology
  - Measurement conversions
  - Classic cocktail recipes
  - Techniques and methods

- 2 comprehensive quizzes:
  - Bartending Basics (5 questions)
  - Classic Cocktails (3 questions)

- 2 interactive games:
  - Measurement Master
  - Ingredient Match

All data is stored locally in your browser!

## Next Steps

Once you're comfortable with the basics:
1. Create 5+ custom flashcards
2. Complete all available quizzes
3. Play each game multiple times
4. Reach Level 3 or higher
5. Unlock all achievements

Happy Learning! 🍸
