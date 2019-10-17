const express = require('express')
import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";


// our static data 
const members = 
[
    {
        id : 1 , 
        name : "mohamed" , 
        mobile : 123456789 , 
        email : "mohamed@gmail.com" , 
        committe : "technical"
    },
    {
        id : 2 , 
        name : "kahled" , 
        mobile : 123456789 , 
        email : "kahled@gmail.com" , 
        committe : "technical"
    },
    {
        id : 3 , 
        name : "karim" , 
        mobile : 123456789 , 
        email : "karim@gmail.com" , 
        committe : "technical"
    },
    {
        id :4 , 
        name : "3baas" , 
        mobile : 123456789 , 
        email : "mohamed@gmail.com" , 
        committe : "technical"
    }
]

const app = express(); 
// middleware 
app.use(express.json()); 
app.use(express.urlencoded({extended : false}))
const con = createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "mokbel",
    password: "abc123",
    database: "test",
    entities: [
        User
    ],
    synchronize: true,
    logging: false
})

// get all members 
app.get("/api/members" , (req , res) => {
    
   con.then(async connection => {
        console.log("our database is on fire ^_^")     
      
       
        let userRepository = connection.getRepository(User);
    
        let savedusers = await userRepository.find();
        console.log("All users from the db: ", savedusers);
        res.json(savedusers)
    
    }).catch(error => console.log(error));
    
    
})

// get single member 
app.get("/api/members/:id" , (req , res) => {

con.then(async connection => {
    
    console.log("our database is on fire ^_^")     
      
        
            let userRepository = connection.getRepository(User);
        
           
           
            let savedusers = await userRepository.findOne(parseInt(req.params.id));
            if (savedusers != undefined)
            {
                console.log("All users from the db: ", savedusers);
                res.json(savedusers)
            }
            else 
            {
                res.status(400).json({massge : `no memeber with id ${req.params.id}`})
            }
        
        }).catch(error => console.log(error));

      
    
    
})


// Create a Member
app.post("/api/members" , (req , res) =>
{
   const member = {
       id : Math.ceil(Math.random()*100)  , 
       name : req.body.name , 
       email : req.body.email , 
       mobile : req.body.mobile  , 
       committe : req.body.committe 
   }
   if (!member.name || !member.email || !member.mobile || !member.committe)
   {
       return res.status(400).json({msg : "please fill all data ^_^"}) 
   }
   
con.then(async connection => {


    console.log("our database is on fire ^_^")     
      
        
           
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.committe = req.body.committe ;
    user.mobile = req.body.mobile ;
    

    let userRepository = connection.getRepository(User);

    await userRepository.save(user);
    console.log("user has been saved");
    let savedusers = await userRepository.find();
    res.json(savedusers)
           
        }).catch(error => console.log(error));
   
//    members.push(member)
//    res.json(members)
// res.redirect('/')
})

// update member 
app.put("/api/members/:id" , (req , res) => {

    con.then(async connection => {
        console.log("our database is on fire ^_^")     
      
               
            
                let userRepository = connection.getRepository(User);
            
               
               
                let savedusers = await userRepository.findOne(parseInt(req.params.id));
                let updates = req.body
                if (savedusers != undefined)
                {
                    
                    savedusers.name = updates.name ? updates.name : savedusers.name 

                    savedusers.email = updates.email ? updates.email : savedusers.email
    
                    savedusers.mobile = updates.mobile ? updates.mobile : savedusers.mobile
    
                    savedusers.committe = updates.committe ? updates.committe : savedusers.committe

                    await userRepository.save(savedusers);
                    res.json(savedusers)
                }
                else 
                {
                    res.status(400).json({massge : `no memeber with id ${req.params.id}`})
                }
            
            }).catch(error => console.log(error));
    
          


})


// delete member 

app.delete("/api/members/:id" , (req , res) => {

    
con.then(async connection => {
    console.log("our database is on fire ^_^")     
      
           
        
            let userRepository = connection.getRepository(User);
            let savedusers = await userRepository.findOne(parseInt(req.params.id));




            if (savedusers != undefined)
            {
               await userRepository.remove(savedusers);
               let all = await userRepository.find();
               res.json({msg : "member deleted" , all})
            }
            else 
            {
                res.status(400).json({massge : `no memeber with id ${req.params.id}`})
            }
        
        }).catch(error => console.log(error));

      


})




// // static folder 
// app.use(express.static(path.join(__dirname , "htmls" )))


const port = process.env.port || 4000; 

app.listen(port , () => console.log(` our port is ${port}`))