'use strict';
const {faker} = require("@faker-js/faker")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const items = generateFakeItems(150);
    await queryInterface.bulkInsert('categories',items, {});
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('categories', null, {});
  }
};

function generateFakeItems(rowsCount){
  const data = [];
  for(let k=0; k < rowsCount; k++){
     const newItem = {
      name: faker.commerce.department(),
      categoryImage: faker.image.url(),
      status: faker.helpers.arrayElement([1,0])
     }
     data.push(newItem)
  }
  return data;
}