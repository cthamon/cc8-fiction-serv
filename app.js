require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const userRoute = require('./routes/userRoute');
const novelRoute = require('./routes/novelRoute');
const orderRoute = require('./routes/orderRoute');

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://test001.trueddns.com:27310']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRoute);
app.use('/novel', novelRoute);
app.use('/order', orderRoute);

app.use((req, res) => {
    res.status(404).json({ message: 'path not found on this server' });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

// app.use(errorMiddleware);

// sequelize.sync({ force: true }).then(() => console.log('DB Sync'));

port = process.env.PORT;
app.listen(port, () => console.log(`server is running at port ${port}`));
