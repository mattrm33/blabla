import jwt from 'jsonwebtoken';

const SECRET="TON_SECRET_KEY";

const admins=[
  {user:"admin1",pass:"1234"},
  {user:"admin2",pass:"1234"},
  {user:"admin3",pass:"1234"}
];

export default function handler(req,res){
  if(req.method!=="POST") return res.status(405).end();
  const {user,pass}=req.body;
  if(admins.find(a=>a.user===user && a.pass===pass)){
    const token=jwt.sign({user},SECRET,{expiresIn:"2h"});
    res.status(200).json({success:true,token});
  } else { res.status(401).json({success:false}); }
}
