exports.validate=(Schema)=>{
    return(req,res,next)=>{
        let x =Schema.validate(req.body,{abortErly:false});
        if(x.error){
    return res.status(400).json({
             status:"fail",
             message:x.error.details
    });

        
    }else{
        next();
    }
}
}