const express = require('express');
require('./db/mongoose');
const routerUser = require('./routers/userRouter');
const routerTask = require('./routers/tasksRouter');

const app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {

//     if (req.method === 'POST' ){
//         res.send('POST request diable')
//     }else{
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send("server in repairing ")
// })

app.use(express.json())
app.use(routerUser);
app.use(routerTask);




app.listen(port, () => {
    console.log("your server is running in port :" +port)
})