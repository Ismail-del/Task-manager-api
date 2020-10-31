const sendGrid = require('@sendgrid/mail');


// sendGrid.sendGridKeyApi();

sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmailCreation = (email, name) => {
    sendGrid.send({
        to:email,
        from:'ismailsaghraoui@gmail.com',
        subject:'read garefully this mail please',
        text:`you welcome ${name} in the first application`
    })
}
const deletEmailmessage = (email, name) => {
    sendGrid.send({
        to:email,
        from:'ismailsaghraoui@gmail.com',
        subject:'delete your account',
        text:`see you next time ${name} have a good day`
    })
}

module.exports = {
    sendEmailCreation,
    deletEmailmessage
}
// .then(() => {
//     console.log("email sent")
// }).catch((e) => {
//     console.log(e.response.body.errors[0].message)
// })