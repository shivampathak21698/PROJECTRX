const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.DB,
 {
     useNewUrlParser:true,
     useUnifiedTopology:true

}).then(() => {
    // console.warn("DB is connected");
 })
 .catch((err)=>{
     console.warn(err)
 })