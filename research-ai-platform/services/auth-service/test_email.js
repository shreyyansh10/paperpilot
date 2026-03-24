require('dotenv').config()
const nodemailer = require('nodemailer')

console.log('EMAIL_USER:', process.env.EMAIL_USER)
console.log('EMAIL_PASS set:', !!process.env.EMAIL_PASS)
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length)

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.log('TRANSPORTER ERROR:', error.message)
    } else {
        console.log('Transporter OK! Sending test email...')

        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'shreyanshpipaliya@gmail.com',
            subject: 'PaperPilot Test',
            text: 'Your OTP is: 123456'
        }, (err, info) => {
            if (err) {
                console.log('SEND ERROR:', err.message)
            } else {
                console.log('Email sent! ID:', info.messageId)
            }
        })
    }
})