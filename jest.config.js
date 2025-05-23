module.exports = {
  testEnvironment: "jsdom",
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!uuid)/',  // Щоб трансформувати uuid
  ],
};
