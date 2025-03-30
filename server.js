const express=require('express')  
const mongoose=require('mongoose')
const multer = require('multer');



require('dotenv').config()
const User=require('./models/User')
const Product = require('./models/Product');
const bcrypt=require('bcryptjs')

const app = express();
const PORT=3000
app.use(express.json())
app.use('/uploads', express.static('uploads'));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Folder to store images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});
const upload = multer({ storage: storage });

//connecting mongodb atlas
mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log("DB connected successfuly")
).catch(
    (err)=>console.log(err)
)

//api landing page http//localhost:3000/
app.get('/',async(req,res)=>{
    try{
          res.send("<h1 align=center>welcome to the backend and week 2</h1>")
    }
    catch(err)
    {
        console.log(err)
    }
})

//API resistratin page

app.post('/register',async(req,res)=>{
    const {user,email,password}=req.body
    try{
       const hashPassword=await bcrypt.hash(password,10)
       const newUser=new User({user,email,password:hashPassword})
       await newUser.save()
       console.log("New user is registeed successfuly")
       res.json({message:"User created.."})
    }
    catch(err)
    {
        console.log(err)
    }
})

//API Login page
app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const user = await User.findOne({email})
        if (!user || !(await bcrypt.compare(password,user.password)))
        {
          return res.status(400).json({ message:"Invalid Cedentials"});
        }
        res.json({message:"Login successfuly",username:user.username})

    }
    catch(err)
    {
        console.log(err)
    }
}
)

//API for  add Product
app.post('/add-product', async (req, res) => {
    const { name, price, description, category, image } = req.body;

    try {
        const newProduct = new Product({ name, price, description,category,image});
        await newProduct.save();
        console.log(`New product added: ${name} | Price: ${price}`);
        res.json({ message: "Product added successfully", product: newProduct });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error adding product" });
    }
});


//serving running and texting
app.listen(PORT,(err) =>{
    if(err){
        console.log(err)
    }
    console.log("server is running on port | This server: "+PORT)
})