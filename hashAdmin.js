const bcrypt = require('bcrypt');

const password = 'ant@2025'; // your admin plain password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
