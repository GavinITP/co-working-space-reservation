import { Document } from "mongoose";

interface CoWorkingSpaceType extends Document {
  name: string;
  address: string;
  telephone: string;
  openingTime: string;
  closingTime: string;
}

interface FeedBackType extends Document {
  coWorkingSpace: string;
  user: string;
  feedBackString: string;
  rating: number;
  createdAt: Date;
}

interface ReservationType extends Document {
  user: string;
  coWorkingSpace: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface UserType extends Document {
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  password: string;
}

export { CoWorkingSpaceType, FeedBackType, ReservationType, UserType };
