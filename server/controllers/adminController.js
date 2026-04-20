const User = require("../models/User");
const Company = require("../models/Company");
const Internship = require("../models/Internship");
const Application = require("../models/Application");
const Payment = require("../models/Payment");
const StudentProfile = require("../models/Studentprofilemodel");

/* ===========================
   ADMIN DASHBOARD DATA
=========================== */

// Get overall system summary
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCompanies = await User.countDocuments({ role: "company" });
    const verifiedCompanies = await Company.countDocuments({ status: "Verified" });
    const totalInternships = await Internship.countDocuments();
    const totalApplications = await Application.countDocuments();

    // Financial Metrics
    const completedPayments = await Payment.find({ status: "Completed" });
    
    let totalRevenue = 0;
    let stipendsPaid = 0;

    completedPayments.forEach(payment => {
      if (payment.paymentType === "RegistrationFee") {
        totalRevenue += payment.amount;
      } else if (payment.paymentType === "Stipend") {
        stipendsPaid += payment.amount;
      }
    });

    res.json({
      totalStudents,
      totalCompanies,
      verifiedCompanies,
      totalInternships,
      totalApplications,
      totalRevenue,
      stipendsPaid
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   VIEW ALL APPLICATIONS
=========================== */

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("studentId", "name email")
      .populate({
        path: "internshipId",
        select: "title",
        populate: {
          path: "companyId",
          select: "companyName"
        }
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   VIEW ALL STUDENTS
=========================== */

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }, "name email role")
      .sort({ createdAt: -1 });

    const profiles = await StudentProfile.find({
      userId: { $in: students.map((student) => student._id) }
    });

    const profileMap = new Map(
      profiles.map((profile) => [String(profile.userId), profile])
    );

    res.json(
      students.map((student) => ({
        _id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        profile: profileMap.get(String(student._id)) || null
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   VIEW ALL INTERNSHIPS
=========================== */

exports.getAllInternshipsAdmin = async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate("companyId", "companyName status")
      .sort({ createdAt: -1 });

    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
