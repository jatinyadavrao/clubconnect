import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export async function sendMail(email, token) {
try{
    const info = await transporter.sendMail({
      from: `"ClubConnect" <${process.env.EMAIL_USER}>`,
      to: email, 
      subject: "Verify Your Email", 
      text: `Please click the following link to verify your email: ${process.env.NEXT_PUBLIC_SITE_URL}/create-account/${token}`, 
    });

    console.log("Message sent: %s", info.messageId);

  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function sendMailForgotPass(email, token){
 try{
  const info = await transporter.sendMail({
    from: `"ClubConnect" <${process.env.EMAIL_USER}>`,
    to: email, 
    subject: "Forgot Password", 
    text: `Please click the following link to Reset Your Password: ${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/${token}`, 
  });

} catch (error) {
  console.error("Error sending email:", error);
}
}
