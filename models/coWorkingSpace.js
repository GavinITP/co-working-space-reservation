const mongoose = require("mongoose");

const CoworkingSpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name for the co-working space"],
  },
  address: {
    type: String,
    required: [true, "Please add an address for the co-working space"],
  },
  telephone: {
    type: String,
    match: [/^[0-9]{10}$/, "Please add a valid 10-digit phone number"],
    required: [true, "Please add a telephone number for the co-working space"],
  },
  openingTime: {
    type: String,
    match: [
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
      "Please use a valid time format (HH:mm:ss)",
    ],
    required: [true, "Please add the opening time for the co-working space"],
  },
  closingTime: {
    type: String,
    match: [
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
      "Please use a valid time format (HH:mm:ss)",
    ],
    required: [true, "Please add the closing time for the co-working space"],
  },
});


//Cascade Delete Feedback when a co-working-apace is deleted 
CoworkingSpaceSchema.pre('deleteOne',{document:true , query: false}, async function(next){
  console.log(`Feed back are being remove from co-working-apace ${this._id}`);
  await this.model('feedback').deleteMany({coWorkingSpace : this._id});
  next();
});

// Reverse populate with virtuals
CoworkingSpaceSchema.virtual('feedback' , {
  ref: "feedback",
  localField :  "_id",
  foreignField : 'coWorkingSpace',
  justOne:false
})

module.exports = mongoose.model("CoworkingSpace", CoworkingSpaceSchema);
