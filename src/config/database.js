const {PrismaClient} = require('@prisma/client');
const {PrismaPg} = require('@prisma/adapter-pg');
const {Pool} = require('pg');
require("dotenv").config()

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
     connectionString,
});
const pgAdapter = new PrismaPg(pool);



const prisma = new PrismaClient({
    adapter: pgAdapter,
});


async function connectDB(){
    try{
        await prisma.$connect();
        console.log("Database connected successfully");
    }catch(err){
        console.error("Database connection failed", err);
        process.exit(1);
    }
}

module.exports = {  prisma, connectDB};