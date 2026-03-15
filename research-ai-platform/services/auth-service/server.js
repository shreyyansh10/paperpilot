// SETUP STEPS (already done automatically below):
// 1. Database created via psql
// 2. npm install
// 3. npx prisma migrate dev --name init
// 4. npx prisma generate
// 5. npm run dev

require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 8005;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});