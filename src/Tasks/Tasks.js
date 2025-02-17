import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { LOGIN_REQUEST, PUBLIC_CLIENT_APPLICATION } from '../AzureAd/msalConfig.js';
import { BsPlus, BsClock, BsBoxArrowRight, BsTrash } from 'react-icons/bs';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [token, setToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({
        name: '',
        description: '',
        assignee: ''
    });

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tokenResponse = await PUBLIC_CLIENT_APPLICATION.acquireTokenSilent(LOGIN_REQUEST);
                const accessToken = tokenResponse.accessToken;
                setToken(accessToken);

                const rolesResponse = await axios.get("https://graph.microsoft.com/v1.0/me/memberOf", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const userRoles = rolesResponse.data.value.map(role => role.displayName);
                setIsAdmin(userRoles.includes("Global Administrator"));

                const response = await axios.get('http://localhost:5001/tasks');
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleCreateTask = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewTask({
            name: '',
            description: '',
            assignee: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitTask = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/tasks', newTask);
            setTasks(prevTasks => [response.data, ...prevTasks]);
            handleCloseModal();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5001/tasks/tasks/${taskId}`);
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleSignOut = () => {
        PUBLIC_CLIENT_APPLICATION.logout();
    };

    if (loading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    return (
        <div className="min-vh-100 bg-light">
            {/* Navbar */}
            <Navbar bg="dark" variant="dark" className="mb-4">
                <div className="container d-flex justify-content-between align-items-center">
                    <div style={{ width: "33%" }}></div>
                    <Navbar.Brand className="mx-auto">
                        {isAdmin ? "Admin Task Manager" : "Task Manager"}
                    </Navbar.Brand>
                    <div className="d-flex align-items-center" style={{ width: "33%", justifyContent: "flex-end" }}>
                        <Button variant="outline-light" onClick={handleSignOut} className="d-flex align-items-center">
                            <BsBoxArrowRight className="me-2" size={16} />
                            Logout
                        </Button>
                    </div>
                </div>
            </Navbar>

            {/* Task Inbox Header */}
            <div className="container d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">Task Inbox</h3>
                {isAdmin && (
                    <Button 
                        variant="primary"
                        onClick={handleCreateTask}
                        className="d-flex align-items-center"
                    >
                        <BsPlus className="me-2" size={20} />
                        Add Task
                    </Button>
                )}
            </div>

            {/* Task List */}
            <div className="container">
                {tasks.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                        No tasks available
                    </div>
                ) : (
                    <div>
                        {tasks.map((task) => (
                            <div key={task._id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h3 className="h5 mb-2">{task.name}</h3>
                                        <p className="text-muted mb-0">{task.description}</p>
                                    </div>
                                    <div className="d-flex flex-column align-items-end">
                                        <p className="text-muted small d-flex align-items-center">
                                            <BsClock className="me-1" />
                                            {new Date(task.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-muted small mt-1">
                                            Assignee: {task.assignee}
                                        </p>
                                        {isAdmin && (
                                            <Button 
                                                variant="danger" 
                                                size="sm" 
                                                className="mt-2"
                                                onClick={() => handleDeleteTask(task._id)}
                                            >
                                                <BsTrash className="me-2" /> Delete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Task Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Task</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitTask}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Task Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newTask.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={newTask.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Assignee</Form.Label>
                            <Form.Control
                                type="text"
                                name="assignee"
                                value={newTask.assignee}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Create Task
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default Tasks;
