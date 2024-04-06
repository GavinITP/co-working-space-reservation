import { Request, Response } from "express";
import CoWorkingSpace from "../models/coWorkingSpace";
import Feedback from "../models/feedback";

//@desc     Get all feedback
//@route    GET api/v1/feedbacks
//@access   Public
const getFeedbacks = async (req: Request, res: Response) => {
  try {
    let query;

    // General User can see only their appointments!
    if (req.user.role !== "admin") {
      console.log(req.user.name);
      query = Feedback.find({ user: req.user.id }).populate({
        path: "coWorkingSpace",
        model: CoWorkingSpace,
        select: "name address telephone",
      });
      // console.log(query)
    } else {
      // Admin can see all
      if (req.params.coWorkingSpaceId) {
        let coWorkId = req.params.coWorkingSpaceId;

        query = Feedback.find({ coWorkingSpace: coWorkId }).populate({
          path: "coWorkingSpace",
          model: CoWorkingSpace,
          select: "name address telephone",
        });
      } else {
        query = Feedback.find().populate({
          path: "coWorkingSpace",
          model: CoWorkingSpace,
          select: "name address telephone",
        });
      }
    }

    const FeedBackData = await query;
    // const FeedBackData = await Feedback.find();

    res.status(200).json({
      success: true,
      count: FeedBackData.length,
      data: FeedBackData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find feedback",
    });
  }
};

//@desc     Get single feedback
//@route    GET api/v1/feedbacks/:id
//@access   Public
const getFeedback = async (req: Request, res: Response) => {
  try {
    let fid = req.params.id;
    const feedback = await Feedback.findById(fid).populate({
      path: "coWorkingSpace",
      model: CoWorkingSpace,
      select: "name address telephone",
    });

    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: `No feedback with the id of ${fid}` });
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, massage: "Cannot find feedback" });
  }
};

//@desc     Add a feedback
//@route    POST api/v1/co-working-space/:coWorkingSpaceId/feedbacks
//@access   Private
const addFeedback = async (req: Request, res: Response) => {
  try {
    const cwsid = req.params.coWorkingSpaceId;
    req.body.CoWorkingSpace = cwsid;

    // Check if co-working-space exists
    const CWSpace = await CoWorkingSpace.findById(cwsid);

    if (!CWSpace) {
      return res.status(404).json({
        success: false,
        message: `No co-working-space with the id of ${cwsid}`,
      });
    }

    // Add user Id to req.body
    req.body.user = req.user.id;

    const existedFeedback = await Feedback.find({ user: req.user.id });

    // User can feedback a co-working-space only single time
    if (existedFeedback.length >= 1 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with id ${req.user.id} has already made a feedback to co-working-space with id ${cwsid}`,
      });
    }

    const newFeedback = await Feedback.create(req.body);

    res.status(200).json({
      success: true,
      data: newFeedback,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot create new Feedback",
    });
  }
};

//@desc     Update a feedback
//@route    PUT api/v1/co-working-space/:co-working-spaceId/feedback
//@access   Private
const updateFeedback = async (req: Request, res: Response) => {
  try {
    const fid = req.params.id;
    const user = req.user;

    //check if feedback existed

    let feedback = await Feedback.findById(fid);

    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, massage: `No feedback with the id of ${fid}` });
    }
    //make sure if user is the appointment owner
    if (feedback.user.toString() !== user.id && user.role !== "admin") {
      return res.status(404).json({
        success: false,
        massage: `User ${user.id} is not authorized to update this feedback`,
      });
    }

    feedback = await Feedback.findByIdAndUpdate(fid, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      massage: "Cannot update Feedback",
    });
  }
};

//@desc     Delete a feedback
//@route    DELETE api/v1/co-working-space/:co-working-spaceId/feedback
//@access   Private
const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const fid = req.params.id;
    const user = req.user;

    const feedback = await Feedback.findById(fid);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        massage: `No appointment with the id of ${fid}`,
      });
    }

    //make sure if user is the feedback owner
    if (feedback.user.toString() !== user.id && user.role !== "admin") {
      return res.status(404).json({
        success: false,
        massage: `User ${user.id} is not authorized to delete this bootcamp`,
      });
    }
    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      massage: "Cannot delete feedback",
    });
  }
};

export {
  getFeedbacks,
  getFeedback,
  addFeedback,
  updateFeedback,
  deleteFeedback,
};
