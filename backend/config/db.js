const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PWD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
    // mongodb+srv://gc_groupmania:<password>@cluster0.q6ghdx4.mongodb.net/?retryWrites=true&w=majority
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    }
  )
  .then(() => console.log("🎄 Connected to MongoDB !"))
  .catch((error) => console.log("❌ Failed to connect to MongoDB!", error));
