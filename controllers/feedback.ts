import { Request, Response } from "express";
import coWorkingSpace from "../models/coWorkingSpace";
import FeedBack from "../models/feedBack";

const getFeedbacks = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.role) {
      throw new Error("User role is missing.");
    }

    let query = FeedBack.find();

    if (req.user.role !== "admin") {
      if (!req.user.id) {
        throw new Error("User ID is missing.");
      }
      query = FeedBack.find({ user: req.user.id });
    } else if (req.params.coWorkingSpaceId) {
      query = FeedBack.find({ coWorkingSpace: req.params.coWorkingSpaceId });
    }

    const feedbackData = await query.populate({
      path: "coWorkingSpace",
      select: "name address telephone",
    });

    return res.status(200).json({
      success: true,
      count: feedbackData.length,
      data: feedbackData,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Cannot find feedback",
    });
  }
};

const getFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = await FeedBack.findById(req.params.id).populate({
      path: "coWorkingSpace",
      select: "name address telephone",
    });

    res.status(200).json({
      success: true,
      data: feedback || `No feedback with the id of ${req.params.id}`,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Cannot find feedback",
    });
  }
};

const addFeedback = async (req: Request, res: Response) => {
  try {
    const { coWorkingSpaceId } = req.params;

    if (req.user.role !== "admin") {
      const feedbackExists = await FeedBack.exists({ user: req.user.id });
      if (feedbackExists) {
        return res.status(400).json({
          success: false,
          message: `The user with id ${req.user.id} has already made a feedback.`,
        });
      }
    }

    const CWSpace = await coWorkingSpace.findById(coWorkingSpaceId);
    if (!CWSpace) {
      return res.status(404).json({
        success: false,
        message: `No co-working-space with the id of ${coWorkingSpaceId}`,
      });
    }

    req.body.coWorkingSpace = coWorkingSpaceId;
    req.body.user = req.user.id;

    const newFeedback = await FeedBack.create(req.body);

    res.status(200).json({
      success: true,
      data: newFeedback,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Cannot create new Feedback",
    });
  }
};

const updateFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const feedback = await FeedBack.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `No feedback with the id of ${id}`,
      });
    }

    if (feedback.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this feedback`,
      });
    }

    const updatedFeedback = await FeedBack.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedFeedback,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Cannot update Feedback",
    });
  }
};

const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const feedback = await FeedBack.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `No feedback with the id of ${id}`,
      });
    }

    if (feedback.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this feedback`,
      });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Cannot delete feedback",
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
