import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Badge, Container, Navbar } from "react-bootstrap";
import { MenuItem, Select, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const initialTasks = [
  { id: 1, title: "Complete project report", status: "In Progress", priority: "High", isEditing: false },
  { id: 2, title: "Fix login bug", status: "To Do", priority: "Medium", isEditing: false },
  { id: 3, title: "Update documentation", status: "Completed", priority: "Low", isEditing: false },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "To Do":
      return <Badge bg="secondary">{status}</Badge>;
    case "In Progress":
      return <Badge bg="warning" text="dark">{status}</Badge>;
    case "Completed":
      return <Badge bg="success">{status}</Badge>;
    default:
      return <Badge bg="light">{status}</Badge>;
  }
};

function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);

  // Handle Edit Click
  const handleEdit = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, isEditing: !task.isEditing } : task));
  };

  // Handle Status Change
  const handleStatusChange = (id, newStatus) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, status: newStatus, isEditing: false } : task)));
  };

  // Handle Delete Task
  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Handle Add Task
  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title: "New Task",
      status: "To Do",
      priority: "Medium",
      isEditing: false
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" className="mb-4 p-3">
        <Navbar.Brand className="mx-auto">Task Manager Dashboard</Navbar.Brand>
      </Navbar>

      {/* Add Task Button */}
      <Container>
        <div style={{ display: "flex", visibility: "", justifyContent: "flex-end", alignItems: "center", marginBottom: "10px" }}>
          <IconButton color="primary" onClick={handleAddTask}>
            <AddIcon />
          </IconButton>
          <Typography variant="body1" style={{ cursor: "pointer" }} onClick={handleAddTask}>
            Add Task
          </Typography>
        </div>

        {/* Task Table */}
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Task</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td style={{ width: "350px" }}>
                  {task.isEditing ? (
                    <Select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      size="small"
                      variant="standard"
                      style={{ minWidth: 120 }}
                    >
                      <MenuItem value="To Do">To Do</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  ) : (
                    getStatusBadge(task.status)
                  )}
                </td>
                <td>{task.priority}</td>
                <td>
                  <IconButton color={task.isEditing ? "success" : "default"} onClick={() => handleEdit(task.id)}>
                    {task.isEditing ? <SaveIcon /> : <EditIcon />}
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default Tasks;