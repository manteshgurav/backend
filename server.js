const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3001;

mongoose.set("strictQuery", false);

// Connect to MongoDB Cloud database
mongoose
  .connect(
    "mongodb+srv://user2000:user3000@test-pro-db.wu36v74.mongodb.net/employeeDetails?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(cors());
app.use(express.json());

const Employee = mongoose.model("Employee", {
  employeeName: String,
  address: String,
  phoneNumber: Number,
  employeeType: String,
  salaryFrom: Number,
  salaryTo: Number,
});

const SiteDetail = mongoose.model("SiteDetail", {
  locationName: String,
  address: String,
  startDate: Date,
  targetDate: Date,
});

const Register = mongoose.model("Register", {
  name: String,
  username: String,
  email: String,
  password: String,
  phoneNumber: String,
  employeeId: String,
});

const AddEmployeeToSite = mongoose.model("AddEmployeeToSite", {
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SiteDetail",
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Payment = mongoose.model("Payment", {
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Site", // Assuming you have a Site model
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Assuming you have an Employee model
    required: true,
  },
  jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Assuming you have a Job model
      required: true,
    },
  ],
  finalTotal: {
    type: Number,
    required: true,
  },
  paymentBy: {
    type: Number,
    required: true,
  },
});

const PaymentDetails = mongoose.model("PaymentDetails", {
  employeeType: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  targetDate: {
    type: Date,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
});

const UserEmpLink = mongoose.model("UserEmpLink", {
  userId: String,
  employeeId: String,
});

// API endpoint to get all Employee items
app.get("/api/employeeDetails", async (req, res) => {
  try {
    const employeeDetails = await Employee.find();
    res.json(employeeDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to get all SiteDetail items
app.get("/api/siteDetails", async (req, res) => {
  try {
    const siteDetails = await SiteDetail.find();
    res.json(siteDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get a SiteDetail by ID
app.get("/api/siteDetails/:id", async (req, res) => {
  try {
    const siteDetail = await SiteDetail.findById(req.params.id);

    if (!siteDetail) {
      return res.status(404).json({ error: "SiteDetail not found" });
    }

    res.json(siteDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to delete an Employee by ID
app.delete("/api/employeeDetails/:id", async (req, res) => {
  try {
    const deletedItem = await Employee.findOneAndDelete({ _id: req.params.id });

    if (!deletedItem) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(deletedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to delete a SiteDetail by ID
app.delete("/api/siteDetails/:id", async (req, res) => {
  try {
    const deletedItem = await SiteDetail.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedItem) {
      return res.status(404).json({ error: "SiteDetail not found" });
    }

    res.json(deletedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to create a new Employee
app.post("/api/employeeDetails", async (req, res) => {
  try {
    const {
      employeeName,
      address,
      phoneNumber,
      employeeType,
      salaryFrom,
      salaryTo,
    } = req.body;
    const newItem = new Employee({
      employeeName,
      address,
      phoneNumber,
      employeeType,
      salaryFrom,
      salaryTo,
    });
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to create a new SiteDetail
app.post("/api/siteDetails", async (req, res) => {
  try {
    const { locationName, address, startDate, targetDate } = req.body;
    const newItem = new SiteDetail({
      locationName,
      address,
      startDate,
      targetDate,
    });
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to update an Employee by ID
app.put("/api/employeeDetails/:id", async (req, res) => {
  try {
    const {
      employeeName,
      address,
      phoneNumber,
      employeeType,
      salaryFrom,
      salaryTo,
    } = req.body;
    const updatedItem = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        employeeName,
        address,
        phoneNumber,
        employeeType,
        salaryFrom,
        salaryTo,
      },
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to update a SiteDetail by ID
app.put("/api/siteDetails/:id", async (req, res) => {
  try {
    const { locationName, address, startDate, targetDate } = req.body;
    const updatedItem = await SiteDetail.findByIdAndUpdate(
      req.params.id,
      { locationName, address, startDate, targetDate },
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to create an AddEmployeeToSite record
app.post("/api/addEmployeeToSite", async (req, res) => {
  try {
    const { siteId, employeeId, startDate, endDate } = req.body;
    const newRecord = new AddEmployeeToSite({
      siteId,
      employeeId,
      startDate,
      endDate,
    });
    await newRecord.save();
    res.json(newRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to update an AddEmployeeToSite record
app.put("/api/addEmployeeToSite/:id", async (req, res) => {
  try {
    const { siteId, employeeId, startDate, endDate } = req.body;
    const updatedRecord = await AddEmployeeToSite.findByIdAndUpdate(
      req.params.id,
      { siteId, employeeId, startDate, endDate },
      { new: true }
    );
    if (!updatedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(updatedRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to get all AddEmployeeToSite records
app.get("/api/addEmployeeToSite", async (req, res) => {
  try {
    const records = await AddEmployeeToSite.find()
      .populate("siteId")
      .populate("employeeId");
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define the POST API endpoint for registering a new user
app.post("/api/register", async (req, res) => {
  const { name, username, email, password, phoneNumber, employeeId } = req.body;

  // if (password !== confirmPassword) {
  //   return res.status(400).send("Passwords do not match");
  // }

  const newUser = new Register({
    name,
    username,
    email,
    password,
    phoneNumber,
    employeeId,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Define the GET API endpoint for fetching users
app.get("/api/register", async (req, res) => {
  const { username } = req.query;

  try {
    if (username) {
      const user = await Register.findOne({ username: username });
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send("User not found");
      }
    } else {
      const users = await Register.find({});
      res.status(200).send(users);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/api/login", async (req, res) => {
  debugger;
  const { username, password } = req.body;

  try {
    const user = await Register.findOne({ username: username });
    if (!user) {
      console.log(user);
      return res.status(404).send("User not found");
    }
    if (user.password !== password) {
      return res.status(400).send("Invalid password");
    }
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(400).send("Invalid password");
    // }

    res
      .status(200)
      .send({ message: "Login successful", user: { username: user.username } });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// in your main server file (e.g., server.js or app.js)

// const Payment = require("./models/Payment");
// const PaymentDetails = require("./models/PaymentDetails");

// API endpoint to create a new Payment and PaymentDetails
// app.post("/api/payment", async (req, res) => {
//   const { siteId, employeeId, employeeType, startDate, targetDate, total } =
//     req.body;

//   try {
//     // Create a new PaymentDetails record
//     const paymentDetails = new PaymentDetails({
//       employeeType,
//       startDate,
//       targetDate,
//       total,
//     });

//     const savedPaymentDetails = await paymentDetails.save();

//     // Create a new Payment record
//     const payment = new Payment({
//       siteId,
//       employeeId,
//       employeeType,
//       paymentDetailsId: savedPaymentDetails._id,
//     });

//     const savedPayment = await payment.save();

//     res.status(201).json({
//       message: "Payment and PaymentDetails created successfully",
//       payment,
//       paymentDetails: savedPaymentDetails,
//     });
//   } catch (error) {
//     console.error("Error creating payment:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// API endpoint to create a new Payment and PaymentDetails
app.post("/api/payment", async (req, res) => {
  const { siteId, employeeId, jobs, paymentBy } = req.body;

  try {
    // Save each PaymentDetails record and collect their IDs
    const savedPaymentDetails = await Promise.all(
      jobs.map(async (job) => {
        const paymentDetails = new PaymentDetails({
          employeeType: job.employeeType,
          startDate: job.startDate,
          targetDate: job.targetDate,
          total: job.total,
        });
        return await paymentDetails.save();
      })
    );

    const jobIds = savedPaymentDetails.map((pd) => pd._id);
    const finalTotal = savedPaymentDetails.reduce(
      (acc, pd) => acc + pd.total,
      0
    );

    // Create a new Payment record
    const payment = new Payment({
      siteId,
      employeeId,
      jobs: jobIds,
      finalTotal,
      paymentBy,
    });

    const savedPayment = await payment.save();

    res.status(201).json({
      message: "Payment and PaymentDetails created successfully",
      payment,
      paymentDetails: savedPaymentDetails,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// // API endpoint to get all sites for a particular employee
// app.get("/api/sitesByEmployee/:employeeId", async (req, res) => {
//   try {
//     const { employeeId } = req.params;

//     // Fetch all records for the given employeeId from AddEmployeeToSite
//     const records = await AddEmployeeToSite.find({ employeeId })
//       .populate("siteId", "locationName") // Populate site details to get site name
//       .populate("employeeId", "employeeName"); // Populate employee details

//     // Format the data
//     const result = records.map((record) => ({
//       siteName: record.siteId.locationName,
//       startDate: record.startDate,
//       endDate: record.endDate,
//       // paymentView: `/payment/view/${record._id}`, // Assuming payment view URL pattern
//     }));

//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/api/sitesByUser/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Fetch the employeeId from UserSiteLink using userId
//     const userSiteLink = await UserEmpLink.findOne({ userId });

//     if (!userSiteLink) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const { employeeId } = userSiteLink;

//     // Fetch all records for the given employeeId from AddEmployeeToSite
//     const records = await AddEmployeeToSite.find({ employeeId })
//       .populate("siteId", "locationName") // Populate site details to get site name
//       .populate("employeeId", "employeeName"); // Populate employee details

//     // Format the data
//     const result = records.map((record) => ({
//       siteName: record.siteId.locationName,
//       startDate: record.startDate,
//       endDate: record.endDate,
//       // paymentView: `/payment/view/${record._id}`, // Assuming payment view URL pattern
//     }));

//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.get("/api/sitesByEmployee/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    // Fetch all records for the given employeeId from AddEmployeeToSite
    const records = await AddEmployeeToSite.find({ employeeId })
      .populate("siteId", "locationName") // Populate site details to get site name
      .populate("employeeId", "employeeName"); // Populate employee details to get employee name

    // Format the data
    const result = records.map((record) => ({
      siteName: record.siteId.locationName,
      startDate: record.startDate,
      endDate: record.endDate,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to create a new Employee
app.post("/api/userLink", async (req, res) => {
  try {
    const { userId, employeeId } = req.body;
    const newItem = new UserEmpLink({
      userId,
      employeeId,
    });
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to get all Employee items
app.get("/api/userLink", async (req, res) => {
  try {
    const userlinkDetails = await UserEmpLink.find();
    res.json(userlinkDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
