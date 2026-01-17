const {prisma} = require("../config/database")
const bcrypt = require("bcrypt")
//register user function
async function register(req,res){
    const {name,email,password}=  req.body;
    if(!name||!email||!password){
        return res.status(403).json({status:false,message:"all the fields are required!!"})
    };
    try{
        const existingUser = await  prisma.users.findUnique({where:{email:email}})
    if(existingUser){
        return res.status(403).json({status:false,message:"email already accquired"});
    }
        
    const hashedPassword = await bcrypt.hash(password,10)

    const user = await prisma.users.create({
        data:{
            name:name,
            email:email,
            password:hashedPassword
        }
    })
    return res.status(201).json({status:true,message:"user registered successfully",data:user})
    
    }catch(err){
        res.status(500).json({status:false,message:"internal server error",error:err.message})
    }
    

}




module.exports = {register}