# Game Site Project

A gaming website with user authentication and score tracking. The site features multiple 8-bit games including Snake, Pong, Space Invaders, and Pac-Man.

## Features

- User registration and authentication
- Score tracking for each game
- Leaderboards for each game
- Responsive design

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: SQLite with Sequelize
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

- `models/` - Database models
- `routes/` - API routes
- `middleware/` - Custom middleware
- `public/` - Frontend JavaScript
- `pages/` - HTML pages
- `Games/` - Game logic
- `images/` - Game images
- `fonts/` - Custom fonts
- `sounds/` - Game sounds

## Setup Instructions

### Setting up the project
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   DB_PATH=./database.sqlite
   JWT_SECRET=your_jwt_secret_key_here
   PORT=3000
   ```
4. Start the server:
   ```
   npm start
   ```
5. Open your browser and navigate to `http://localhost:3000`

The application uses SQLite as a local database, which is file-based and doesn't require a separate database server. The database file will be created automatically when you start the application for the first time.

## Інструкції з налаштування (Ukrainian)

### Налаштування проекту
1. Клонуйте репозиторій
2. Встановіть залежності:
   ```
   npm install
   ```
3. Створіть файл `.env` в кореневому каталозі з наступними змінними:
   ```
   DB_PATH=./database.sqlite
   JWT_SECRET=your_jwt_secret_key_here
   PORT=3000
   ```
4. Запустіть сервер:
   ```
   npm start
   ```
5. Відкрийте браузер і перейдіть за адресою `http://localhost:3000`

Додаток використовує SQLite як локальну базу даних, яка базується на файлах і не потребує окремого сервера бази даних. Файл бази даних буде створено автоматично при першому запуску додатка.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user info

### Scores

- `POST /api/scores` - Save a new score
- `GET /api/scores/highscore/:game` - Get user's high score for a game
- `GET /api/scores/leaderboard/:game` - Get leaderboard for a game
- `GET /api/scores/games` - Get all available games

## Adding New Games

To add a new game to the site:

1. Create a new game file in the `Games/` directory
2. Create a new HTML page for the game in the `pages/` directory
3. Add the game to the enum in the Score model
4. Add a link to the game on the main page

## License

This project is open source and available under the [MIT License](LICENSE).
