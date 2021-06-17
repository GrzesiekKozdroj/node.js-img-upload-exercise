const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

const app = express()
const PORT = 4200
const checkFileType = (file,callback)=>{
    //allowed file extensions
    const filetypes = /jpg|jpeg|png|gif/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if( mimetype && extname){
        return callback(null,true)
    } else {
        return callback('Error: images only')
    }
}
const storage = multer.diskStorage({
    destination:'./public/uploads/',
    filename: function(req,file,callback){
        callback(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname) )//error, file new name after rename,
    }
})
const upload = multer({
    limits:{fileSize:10000000},
    fileFilter:function(req,file, callback){
        checkFileType(file, callback)
    },
    storage
}).single('myImage')//can be array for multiple files :D
app.set()
app.set('view engine','ejs')
app.use(express.static('./public'))
app.get('/', (req,res)=>res.render('index'))
app.post('/upload', (req,res)=>{
    upload(req, res, (err)=>{
        if(err){
            res.render('index',{msg:err}) 
        } else {
            //console.log(req.file)//the destination will give me endpoint where to retrieve the img from
            if(req.file==undefined){
                res.render('index', {
                    msg:'No file selected'
                })
            } else {
                res.render(
                    'index', {
                        msg:'File Uploaded!',
                        file:`uploads/${req.file.filename}`
                    })
            }
        }
    })
})
app.listen(PORT, ()=>console.log(`server on: http://localhost:${PORT}/`))

//amazon s3 for saving images aws
//heroku option exist
//heroku has img sotre too
//add fb oauth, account is set
//use anu preexisting thingy
//add a new branch