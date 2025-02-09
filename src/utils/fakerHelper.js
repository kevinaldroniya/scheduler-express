const {faker} = require("@faker-js/faker");

const generateFakeUser = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  date: faker.date.birthdate({ mode: "age", min: 18, max: 70 }),
});

module.exports = { generateFakeUser };
