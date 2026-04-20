const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Internship = require("../models/Internship");
const Company = require("../models/Company");
const { sendEmail } = require("../utils/email");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Apply for an internship (Updated to include application details)
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const {
      internshipId,
      coverLetter,
      whyInterested,
      relevantExperience,
      availability,
      expectedStipend,
      portfolioLinks,
      references,
      questionsForCompany
    } = req.body;

    // Validate required fields
    if (!internshipId || !coverLetter || !whyInterested || !relevantExperience || !availability) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Validate cover letter length
    if (coverLetter.length < 100) {
      return res.status(400).json({ message: "Cover letter must be at least 100 characters" });
    }

    // Check if internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      studentId: req.user.id,
      internshipId
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this internship" });
    }

    // Create new application
    const application = new Application({
      studentId: req.user.id,
      internshipId,
      status: "Pending",
      coverLetter,
      whyInterested,
      relevantExperience,
      availability,
      expectedStipend,
      portfolioLinks,
      references,
      questionsForCompany
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get student's own applications
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate("internshipId")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get applications for a company (for company dashboard)
router.get("/company", authMiddleware, roleMiddleware("company"), async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    
    if (!company) {
      return res.status(404).json({ message: "Company not found. Please complete your company profile first." });
    }
    
    // Then find internships using the company's _id
    const internships = await Internship.find({ companyId: company._id });
    const internshipIds = internships.map(i => i._id);

    const applications = await Application.find({
      internshipId: { $in: internshipIds }
    })
      .populate("studentId", "name email")
      .populate("internshipId")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update application status (for company)
router.put("/update/:id", authMiddleware, roleMiddleware("company"), async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Shortlisted", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate("internshipId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // First find the company associated with the logged-in user
    const company = await Company.findOne({ userId: req.user.id });
    
    if (!company) {
      return res.status(403).json({ message: "You are not authorized to update applications. Company profile not found." });
    }

    // Verify that the company owns this internship
    if (application.internshipId.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ message: "Unauthorized - You can only update applications for your own company" });
    }

    // Use findByIdAndUpdate to only update the status field without triggering full validation
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    )
      .populate("internshipId")
      .populate("studentId", "name email");

    if (updatedApplication?.studentId?.email) {
      await sendEmail({
        to: updatedApplication.studentId.email,
        subject: `Application status updated to ${status}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
            <h2>Application update</h2>
            <p>Hello ${updatedApplication.studentId.name || "Student"},</p>
            <p>Your application for <strong>${updatedApplication.internshipId?.title || "the internship"}</strong> is now marked as <strong>${status}</strong>.</p>
            <p>Please log in to InternHub for the latest details.</p>
          </div>
        `
      });
    }

    res.json({ message: "Application status updated", application: updatedApplication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single application details (for viewing full application)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("studentId", "name email")
      .populate("internshipId")
      .populate({
        path: "studentId",
        populate: {
          path: "profile" // This assumes you've added a virtual or reference to StudentProfile
        }
      });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const isStudentOwner = String(application.studentId?._id || application.studentId) === String(req.user.id);
    const company = await Company.findOne({ userId: req.user.id });
    const isCompanyOwner = company && String(application.internshipId?.companyId) === String(company._id);

    if (!isStudentOwner && !isCompanyOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
