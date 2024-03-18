'use strict';
const {faker} = require("@faker-js/faker")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 
     const items = generateFakeItems(100);
     return queryInterface.bulkInsert('products', items, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Products', null, {});
  }
};

function generateFakeItems(rowsCount){
     //generate code for fake data
     const data = [];
     for(let k = 0; k < rowsCount; k++){
      const newItem = {
        name: faker.commerce.productName(),
        description: "This is test content for product" + (k + 1),
        amount: faker.commerce.price(),
        status: faker.helpers.arrayElement(["active", "inactive"])
      };
      data.push(newItem)
     }
     return data;
}
 

