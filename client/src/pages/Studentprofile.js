import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Code, 
  GraduationCap, 
  Trash2, 
  AlertTriangle,
  Save,
  ChevronLeft,
  BadgeCheck
} from 'lucide-react';
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/Card";
import Input from "../components/ui/Input";

const StudentProfile = () => {
  const [profileData, setProfileData] = useState({
    phone: "",
    college: "",
    degree: "",
    branch: "",
    yearOfStudy: "",
    gpa: "",
    skills: "",
    resume: "",
    linkedin: "",
    github: ""
  });
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") {
      navigate("/");
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get("/student/profile");
      if (res.data && res.data.phone) {
        setProfileData(res.data);
        setIsProfileComplete(true);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setIsProfileComplete(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post("/student/profile", profileData);
      toast.success("Profile saved successfully!");
      setIsProfileComplete(true);
      setTimeout(() => navigate("/student"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    try {
      await API.delete("/student/delete-account");
      toast.success("Account deleted successfully");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-6 animate-pulse">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-64 bg-slate-200 rounded-xl" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      );
  }

  return (
    <div className="w-full space-y-8 text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Professional Profile</h1>
          <p className="text-[var(--text-muted)] mt-1">This information is shared with companies when you apply.</p>
        </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/student')}>
            <ChevronLeft size={16} className="mr-1" />
            Back to Dashboard
          </Button>
        </div>

        {!isProfileComplete && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3 text-indigo-700">
            <BadgeCheck size={20} className="shrink-0" />
            <p className="text-sm font-medium">Complete your profile to unlock all features and start applying for internships.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal & Contact */}
          <Card className="border-slate-200 shadow-sm overflow-visible">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <User size={18} className="text-indigo-600" />
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={profileData.phone}
                onChange={handleChange}
                required
              />
              <Input
                label="LinkedIn Profile"
                name="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={profileData.linkedin}
                onChange={handleChange}
              />
              <Input
                label="GitHub / Portfolio"
                name="github"
                type="url"
                placeholder="https://github.com/username"
                value={profileData.github}
                onChange={handleChange}
              />
              <Input
                label="Resume URL"
                name="resume"
                type="url"
                placeholder="Link to PDF/Doc on Drive/Dropbox"
                value={profileData.resume}
                onChange={handleChange}
                required
              />
            </CardContent>
          </Card>

          {/* Academic Profile */}
          <Card className="border-slate-200 shadow-sm overflow-visible">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-indigo-600" />
                <CardTitle className="text-lg">Educational Background</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <Input
                label="College / University Name"
                name="college"
                placeholder="Indian Institute of Technology, Madras"
                value={profileData.college}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Degree"
                  name="degree"
                  placeholder="B.Tech (Computer Science)"
                  value={profileData.degree}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Branch"
                  name="branch"
                  placeholder="Computer Science & Engineering"
                  value={profileData.branch}
                  onChange={handleChange}
                  required
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 ml-0.5">Year of Study</label>
                  <select
                    name="yearOfStudy"
                    value={profileData.yearOfStudy}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year / Masters</option>
                  </select>
                </div>
                <Input
                  label="Current GPA / CGPA"
                  name="gpa"
                  type="number"
                  step="0.01"
                  placeholder="8.50"
                  value={profileData.gpa}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border-slate-200 shadow-sm overflow-visible">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Code size={18} className="text-indigo-600" />
                <CardTitle className="text-lg">Specializations & Skills</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 ml-0.5">Core Skills (separated by commas)</label>
                <textarea
                  name="skills"
                  value={profileData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, Python, UI Design..."
                  className="min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <CardFooter className="flex justify-end gap-3 bg-white border-none px-0">
             <Button 
               type="submit" 
               size="lg" 
               className="px-8 shadow-indigo-100 shadow-lg"
               isLoading={saving}
             >
               <Save size={18} className="mr-2" />
               Save Profile Changes
             </Button>
          </CardFooter>
        </form>

        {/* Danger Zone */}
        <Card className="border-red-100 bg-red-50/30 overflow-hidden">
          <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-red-900">Delete Account</h3>
                <p className="text-sm text-red-700/70">Permanently remove your account and all associated data.</p>
              </div>
            </div>
            {!showDeleteConfirm ? (
              <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 size={16} className="mr-2" />
                Delete Account
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="Type DELETE"
                  className="px-3 py-1.5 text-xs border border-red-200 rounded bg-white w-28 uppercase"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                />
                <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
                  Confirm
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
};

export default StudentProfile;
