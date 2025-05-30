# Design Patterns in the Game Site Project

This document identifies and describes all the design patterns used in the Game Site Project codebase.

## Frontend Patterns (Games)

### 1. Game Loop Pattern
- **Description**: A central loop that continuously updates game state and renders the display.
- **Files**: `snakeGame.js`, `pongGame.js`, `invadersGame.js`
- **Implementation**: Using `setInterval` or `requestAnimationFrame` to create a continuous game loop.

### 2. State Pattern
- **Description**: Allows an object to alter its behavior when its internal state changes.
- **Files**: `snakeGame.js`, `pongGame.js`, `invadersGame.js`
- **Implementation**: Game states like paused, running, game over that change the behavior.

### 3. Observer Pattern
- **Description**: A subscription mechanism to notify multiple objects about events.
- **Files**: `snakeGame.js`, `pongGame.js`, `invadersGame.js`
- **Implementation**: Event listeners for keyboard input.

### 4. Command Pattern
- **Description**: Encapsulates a request as an object, allowing parameterization of clients with different requests.
- **Files**: `invadersGame.js`
- **Implementation**: Key handling system with command objects.

### 5. Prototype Pattern (Class Inheritance)
- **Description**: A creational pattern that uses prototypical inheritance.
- **Files**: `invadersGame.js`
- **Implementation**: Custom Class.extend implementation for inheritance.

### 6. Factory Method Pattern
- **Description**: Creates objects without specifying the exact class to create.
- **Files**: `invadersGame.js`
- **Implementation**: Creating different types of game entities.

### 7. Object Pool Pattern
- **Description**: Reuses objects that are expensive to create.
- **Files**: `invadersGame.js`
- **Implementation**: Particle system with object pooling for explosions.

## Backend Patterns

### 8. Singleton Pattern
- **Description**: Ensures a class has only one instance and provides a global point of access to it.
- **Files**: `config/database.js`
- **Implementation**: Single Sequelize instance for database connection.

### 9. Module Pattern
- **Description**: Encapsulates related code into modules with private and public parts.
- **Files**: Throughout the codebase in Node.js modules
- **Implementation**: Using Node.js module system with exports.

### 10. Middleware Pattern
- **Description**: Chain of responsibility for processing requests.
- **Files**: `server.js`, `middleware/auth.js`
- **Implementation**: Express middleware for authentication and request processing.

### 11. MVC Pattern (Model-View-Controller)
- **Description**: Separates application into three components: Model, View, and Controller.
- **Files**: Models in `models/`, Routes in `routes/`, Views in `pages/`
- **Implementation**: Separation of data models, route controllers, and HTML views.

### 12. Repository Pattern
- **Description**: Mediates between the domain and data mapping layers.
- **Files**: `models/User.js`, `models/Score.js`
- **Implementation**: Sequelize models that encapsulate data access.

### 13. Active Record Pattern
- **Description**: An object carries both data and behavior.
- **Files**: `models/User.js`, `models/Score.js`
- **Implementation**: Sequelize models with data and methods.

### 14. DTO Pattern (Data Transfer Object)
- **Description**: Objects that carry data between processes.
- **Files**: `routes/auth-server.js`, `routes/scores-server.js`
- **Implementation**: Transforming data before sending it to the client.

### 15. Facade Pattern
- **Description**: Provides a simplified interface to a complex subsystem.
- **Files**: `models/index.js`, `routes/scores-server.js`
- **Implementation**: Simplified interfaces to models and score functionality.

### 16. Strategy Pattern
- **Description**: Defines a family of algorithms and makes them interchangeable.
- **Files**: `routes/scores-server.js`
- **Implementation**: Different strategies for handling different types of score requests.

### 17. Decorator Pattern
- **Description**: Adds responsibilities to objects dynamically.
- **Files**: `models/User.js`
- **Implementation**: Extending the Sequelize Model class with additional methods.

### 18. Hook Pattern
- **Description**: Code that gets executed at specific points in a process.
- **Files**: `models/User.js`
- **Implementation**: Sequelize hooks for password hashing.

### 19. Validator Pattern
- **Description**: Validates data before processing.
- **Files**: `models/User.js`, `models/Score.js`, `routes/scores-server.js`
- **Implementation**: Validation rules for data fields.

### 20. Router Pattern
- **Description**: Routes requests to appropriate handlers.
- **Files**: `routes/auth-server.js`, `routes/scores-server.js`
- **Implementation**: Express Router for organizing routes.

## Conclusion

The Game Site Project demonstrates a wide variety of design patterns across both frontend and backend components. These patterns help organize the code, make it more maintainable, and follow established best practices in software development.