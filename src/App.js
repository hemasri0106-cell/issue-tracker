import React, { useState } from "react";
import "./App.css";

// ----- Hard-coded initial data -----
const initialIssues = [
  {
    id: 1,
    title: "Bug in login page",
    owner: "Alice",
    status: "Open",
    created: "2025-11-20",
    effort: 3,
    due: "2025-11-30",
  },
  {
    id: 2,
    title: "UI alignment problem",
    owner: "Bob",
    status: "In Progress",
    created: "2025-11-18",
    effort: 5,
    due: "2025-12-05",
  },
  {
    id: 3,
    title: "Add export button",
    owner: "Charlie",
    status: "Closed",
    created: "2025-11-10",
    effort: 2,
    due: "",
  },
];

// ----- Row component -----
function IssueRow({ issue, onStatusChange }) {
  return (
    <tr className="issue-row">
      <td>{issue.id}</td>
      <td>{issue.title}</td>
      <td>{issue.owner}</td>

      <td>
        <select
          value={issue.status}
          onChange={(e) => onStatusChange(issue.id, e.target.value)}
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </td>

      <td>{issue.created}</td>
      <td>{issue.effort}</td>
      <td>{issue.due || "-"}</td>
    </tr>
  );
}

// ----- Table component -----
function IssueTable({ issues, onStatusChange }) {
  return (
    <table className="issue-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Owner</th>
          <th>Status</th>
          <th>Created</th>
          <th>Effort (days)</th>
          <th>Due</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue) => (
          <IssueRow
            key={issue.id}
            issue={issue}
            onStatusChange={onStatusChange}
          />
        ))}
      </tbody>
    </table>
  );
}

// ----- Filter component -----
function IssueFilter({ statusFilter, setStatusFilter }) {
  return (
    <div className="issue-filter">
      <label>Filter Status: </label>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
      </select>
    </div>
  );
}

// ----- Add Issue form -----
function IssueAdd({ onAdd }) {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState("Open");
  const [effort, setEffort] = useState("");
  const [due, setDue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!title || !owner) {
      alert("Title and Owner are required");
      return;
    }

    const newIssue = {
      title,
      owner,
      status,
      effort: effort ? Number(effort) : 0,
      due,
    };

    onAdd(newIssue);

    // reset form
    setTitle("");
    setOwner("");
    setStatus("Open");
    setEffort("");
    setDue("");
  }

  return (
    <div className="issue-add">
      <h3>Add New Issue</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>

        <input
          type="number"
          placeholder="Effort (days)"
          value={effort}
          onChange={(e) => setEffort(e.target.value)}
        />

        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />

        <button type="submit">Add Issue</button>
      </form>
    </div>
  );
}

// ----- Main App component -----
export default function App() {
  const [issues, setIssues] = useState(initialIssues);
  const [statusFilter, setStatusFilter] = useState("All");

  function handleAddIssue(issueData) {
    const newId =
      issues.length === 0 ? 1 : Math.max(...issues.map((i) => i.id)) + 1;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const newIssue = {
      id: newId,
      created: today,
      ...issueData,
    };

    setIssues([...issues, newIssue]);
  }

  function handleStatusChange(id, newStatus) {
    const updatedIssues = issues.map((issue) =>
      issue.id === id ? { issue, ...issue, status: newStatus } : issue
    );
    setIssues(updatedIssues);
  }

  const filteredIssues =
    statusFilter === "All"
      ? issues
      : issues.filter((issue) => issue.status === statusFilter);

  return (
    <div className="app">
      <h1>Issue Tracker</h1>
      <IssueFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <IssueTable
        issues={filteredIssues}
        onStatusChange={handleStatusChange}
      />
      <IssueAdd onAdd={handleAddIssue} />
    </div>
  );
}
