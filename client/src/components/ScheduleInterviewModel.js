import React, { useState } from "react";
import Button from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import Input from "./ui/Input";

const ScheduleInterviewModal = ({ application, onClose, onSchedule }) => {
  const [interviewData, setInterviewData] = useState({
    scheduledDate: "",
    scheduledTime: "",
    duration: "60",
    interviewType: "Video Call",
    meetingLink: "",
    location: "",
    instructions: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule(interviewData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto shadow-2xl">
        <CardHeader className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Schedule Interview</CardTitle>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {application.studentId?.name} • {application.internshipId?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            type="button"
          >
            ×
          </button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Interview Date"
                type="date"
                value={interviewData.scheduledDate}
                onChange={(e) => setInterviewData({ ...interviewData, scheduledDate: e.target.value })}
                required
                min={new Date().toISOString().split("T")[0]}
              />
              <Input
                label="Interview Time"
                type="time"
                value={interviewData.scheduledTime}
                onChange={(e) => setInterviewData({ ...interviewData, scheduledTime: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
              <div className="space-y-1.5">
                <label className="ml-0.5 text-sm font-medium text-[var(--text-secondary)]">
                  Interview Type
                </label>
                <select
                  value={interviewData.interviewType}
                  onChange={(e) => setInterviewData({ ...interviewData, interviewType: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                >
                  <option value="Video Call">Video Call</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Technical Round">Technical Round</option>
                  <option value="HR Round">HR Round</option>
                </select>
              </div>
              <Input
                label="Duration (min)"
                type="number"
                value={interviewData.duration}
                onChange={(e) => setInterviewData({ ...interviewData, duration: e.target.value })}
                min="15"
                max="180"
                step="15"
              />
            </div>

            {(interviewData.interviewType === "Video Call" || interviewData.interviewType === "Technical Round") && (
              <Input
                label="Meeting Link"
                type="url"
                value={interviewData.meetingLink}
                onChange={(e) => setInterviewData({ ...interviewData, meetingLink: e.target.value })}
                placeholder="https://meet.google.com/... or https://zoom.us/..."
              />
            )}

            {interviewData.interviewType === "In-Person" && (
              <Input
                label="Interview Location"
                type="text"
                value={interviewData.location}
                onChange={(e) => setInterviewData({ ...interviewData, location: e.target.value })}
                required
                placeholder="Office address, room number, etc."
              />
            )}

            <div className="space-y-1.5">
              <label className="ml-0.5 text-sm font-medium text-[var(--text-secondary)]">
                Special Instructions
              </label>
              <textarea
                value={interviewData.instructions}
                onChange={(e) => setInterviewData({ ...interviewData, instructions: e.target.value })}
                placeholder="Preparation notes, documents to bring, dress code, etc."
                className="min-h-[110px] w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
              />
            </div>

            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] p-4 text-sm text-[var(--text-muted)]">
              The candidate will receive an email with the interview details after scheduling succeeds.
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Schedule Interview
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleInterviewModal;
