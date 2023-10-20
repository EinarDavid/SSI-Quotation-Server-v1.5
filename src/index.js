const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const ssiRoutes = require('./routes/ssi.routes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(ssiRoutes);

app.use((err, req, res, next)=>{
    return res.json({
        message: err.message
    })
})

app.listen(4500);
console.log('Server on port 4500');