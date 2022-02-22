const ROLE = {
  ADMIN: 'admin',
  BASIC: 'basic',
  SALES: 'sales'
}

module.exports = {
  ROLE: ROLE,
  users: [
    { id: 1, name: 'atul', password:"atul123", role: ROLE.ADMIN },
    { id: 2, name: 'saurav', password:"saurav123", role: ROLE.BASIC },
    { id: 3, name: 'kashish', password:"123", role: ROLE.SALES }
  ],
  profiles: [
    { id: 1, name: "atul Profile", userId: 1 },
    { id: 2, name: "saurav Profile", userId: 2 },
    { id: 3, name: "kashish Profile", userId: 3 }
  ]
}