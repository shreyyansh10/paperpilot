require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

console.log('DATABASE_URL:', process.env.DATABASE_URL)

const prisma = new PrismaClient()

async function test() {
    try {
        await prisma.$connect()
        console.log('DB Connected!')

        const users = await prisma.user.findMany({ take: 1 })
        console.log('Users query works! Count:', users.length)

        const otps = await prisma.oTP.findMany({ take: 1 })
        console.log('OTP query works! Count:', otps.length)

        process.exit(0)
    } catch (e) {
        console.log('DB Error:', e.message)
        process.exit(1)
    }
}

test()