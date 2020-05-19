exports.seed = function (knex) {
  // 000-cleanup.js already cleaned out all tables

  const users = [
    {
      username: "david", // will get id 1
      password: "abc123", 
      department: "executive"
    },
    {
      username: "jack", // will get id 2
      password: "az12", 
      department: "software division"
    },
    {
      username: "billy",
      password: "catz",
      department: "hardware division"
    }
  ];

  return knex('users')
    .insert(users)
    .then(() => console.log("\n== Seed data for roles table added. ==\n"));
};