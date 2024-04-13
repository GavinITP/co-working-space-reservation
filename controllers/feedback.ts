import { Request, Response } from "express";
import CoWorkingSpace from "../models/coWorkingSpace";
import Feedback from "../models/feedback";

//@desc     Get all feedback
//@route    GET api/v1/feedbacks
//@access   Public
const getFeedbacks = async (req: Request, res: Response) => {
  try {
    let query = Feedback.find();

    // If the user is not an admin, filter feedbacks by user ID
    if (req.user.role !== "admin") {
      query = query.where({ user: req.user.id });
    }

    const feedbackData = await query.populate({
      path: "coWorkingSpace",
      model: CoWorkingSpace,
      select: "name address telephone",
    });

    res.status(200).json({
      success: true,
      count: feedbackData.length,
      data: feedbackData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch feedbacks",
    });
  }
};

//@desc     Get single feedback
//@route    GET api/v1/feedbacks/:id
//@access   Public
const getFeedbackById = async (req: Request, res: Response) => {
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
      .json({ success: false, message: "Cannot find feedback" });
  }
};

//@desc     Add a feedback
//@route    POST api/v1/feedbacks/
//@access   Private
const addFeedback = async (req: Request, res: Response) => {
  try {
    // const { coWorkingSpace } = req.body;
    // const cwsid = coWorkingSpace;
    const cwsid = req.params.coWorkingSpaceId;

    req.body.coWorkingSpace = cwsid;

    // Check if co-working-space exists
    const CWSpace = await CoWorkingSpace.findById(cwsid);
    if (!CWSpace) {
      return res.status(404).json({
        success: false,
        message: `No co-working space with the id of ${cwsid}`,
      });
    }

    // User can feedback a co-working-space only single time
    const existedFeedback = await Feedback.find({
      user: req.user.id,
      coWorkingSpace: cwsid,
    });
    if (existedFeedback.length >= 1 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with id ${req.user.id} has already made a feedback to co-working space with id ${cwsid}`,
      });
    }

    // Add user Id to req.body
    req.body.user = req.user.id;
    const newFeedback = await Feedback.create(req.body);

    res.status(200).json({
      success: true,
      data: newFeedback,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

//@desc     Update a feedback
//@route    PUT api/v1/feedbacks/:id
//@access   Private
const updateFeedback = async (req: Request, res: Response) => {
  try {
    const fid = req.params.id;
    const user = req.user;

    // check if feedback existed
    let feedback = await Feedback.findById(fid);
    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: `No feedback with the id of ${fid}` });
    }

    // make sure if user is the appointment owner
    if (feedback.user.toString() !== user.id && user.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: `User ${user.id} is not authorized to update this feedback`,
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
      message: "Cannot update Feedback",
    });
  }
};

//@desc     Delete a feedback
//@route    DELETE api/v1/feedbacks/:id
//@access   Private
const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const fid = req.params.id;
    const user = req.user;

    const feedback = await Feedback.findById(fid);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `No feedback with the id of ${fid}`,
      });
    }

    //make sure if user is the feedback owner
    if (feedback.user.toString() !== user.id && user.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: `User with id ${user.id} is not authorized to delete this feedback`,
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
      message: "Cannot delete feedback",
    });
  }
};

export {
  getFeedbacks,
  getFeedbackById,
  addFeedback,
  updateFeedback,
  deleteFeedback,
};
