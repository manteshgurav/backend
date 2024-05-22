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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
