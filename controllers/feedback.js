const coWorkingSpace = require("../models/coWorkingSpace");
const FeedBack = require('../models/feedback');
// const user = require('../models/user');

//@desc     Get all feedback 
//@route    GET api/v1/feedbacks
//@access   Public

exports.getFeedbacks = async (req , res , next) =>{
    let query;

    // General User can see only their appointments!
    if (req.user.role !== 'admin'){
        console.log(req.user.name);
        query = FeedBack.find({user:req.user.id}).populate({
            path: 'coWorkingSpace',
            select: 'name address telephone'
        });
        // console.log(query)
    }
    else{ // Admin can see all
        if(req.params.coWorkingSpaceId){
            let coWorkId = req.params.coWorkingSpaceId;

            console.log(coWorkId);

            query = FeedBack.find({coWorkingSpace:coWorkId}).populate({
                path: 'coWorkingSpace',
                select: 'name address telephone'
            });
        }
        else{
            query = FeedBack.find().populate({
                path: 'hospital',
                select: 'name province tel'
            });
        }
    }

    try {
        const feedBackData = await query;
        
        res.status(200).json({
            success: true,
            count: feedBackData.length,
            data : feedBackData
        });

    }
    catch(error){
        
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Cannot find feedback"
    });
    
    }  
}