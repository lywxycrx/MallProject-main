//搭建express服务
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './router.js'; // Ensure the correct file extension

const app = express();

// Post request form data
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

// Enable CORS
app.use(cors());

// Static file hosting - Access: http://localhost:8888/image.jpg
app.use(express.static('upload'));

// Routes
app.use('/api', router);

app.listen(8888, () => {
  console.log('Server is running on port 8888');
});


//app.listen(8888,()=>{
//    console.log(8888);
//})
