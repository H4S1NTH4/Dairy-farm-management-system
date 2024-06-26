import React, { useEffect, useState } from 'react';
import '../../styles/animvac.css';
import axios from "axios";
import ExamineAnimrForm from '../../components/Veterinary/examineAnim_form';
import CustomizedTables from '../../components/Veterinary/table';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TablePagination, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

const ExamineAnim = ({ handleClose }) => {
    const [addSection, setAddSection] = useState(false);
    const [editSection, setEditSection] = useState(false);
    const [formData, setFormData] = useState({
        earTag: "",
        currentStatus: "",
        exam: "",
        checkdate: null,
    });
    const [formDataEdit, setFormDataEdit] = useState({
        earTag: "",
        currentStatus: "",
        exam: "",
        checkdate: null,
        _id: ""
    });
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOnChange = (e) => {
        const { value, name } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (formData) => {
        try {
            const data = await axios.post("http://localhost:3000/api/exmAnim/create", formData);
            if (data.data.success) {
                setAddSection(false);
                toast.success("Successfully added");
                getFetchData();
                setFormData({
                    earTag: "",
                    currentStatus: "",
                    exam: "",
                    checkdate: null,
                });
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message === "Ear tag does not exist") {
                toast.error("Ear tag doesn't exist");
            } else {
                console.error("Error adding animal:", error);
                alert("Error adding animal. Please try again later.");
            }
        }
    };

    const getFetchData = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/exmAnim/retrieve");
            if (response.data.success) {
                setDataList(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Error fetching data. Please try again later.");
        }
    };

    useEffect(() => {
        getFetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const deleteResponse = await axios.delete(`http://localhost:3000/api/exmAnim/delete/${id}`);
                        getFetchData();
                        if (deleteResponse.data.success) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                        } else {
                            Swal.fire({
                                title: "Error!",
                                text: "Failed to delete the file.",
                                icon: "error"
                            });
                        }
                    }
                });
            
        } catch (error) {
            console.error("Error deleting animal:", error);
            alert("Error deleting animal. Please try again later.");
        }
    };


    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/api/exmAnim/update/${formDataEdit._id}`, formDataEdit);
            if (response.data.success) {
                toast.success("Data Updated Successfully");
                getFetchData();
                setEditSection(false);
            }
        } catch (error) {
            console.error("Error updating animal:", error);
            alert("Error updating animal. Please try again later.");
        }
    };

    const handleEditOnChange = async (e) => {
        const { value, name } = e.target;
        setFormDataEdit(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/exmAnim/retrieve/${id}`);
            if (response.data.success) {
                setFormDataEdit({ ...response.data.data, _id: id }); // Include _id in formDataEdit
                setEditSection(true);
            }
        } catch (error) {
            console.error("Error fetching animal data:", error);
            alert("Error fetching animal data. Please try again later.");
        }
    };

    const headers = [
        "Ear Tag",
        "Current Status",
        "Examination",
        "Date",
        "Action",
    ];

    const filteredData = dataList.filter(item => {
        if (!searchTerm) return true;
        return Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()));
    });


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <ToastContainer />
            <div style={{
                flex: 1,
                padding: '10px',
                margin: '50px ',
                marginBottom: '20px',
                fontFamily: 'Poppins, sans-serif',
                marginTop: '-80px'
            }}>


                {!addSection && !editSection && (
                    <Grid container spacing={2} style={{ marginLeft: '700px', marginTop: '100px' }}>
                        <Grid item xs={3}>
                            <div style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
                                <TextField
                                    onChange={(event) => {
                                        setSearchTerm(event.target.value);
                                    }}
                                    placeholder="Search..."
                                    InputProps={{
                                        startAdornment: (
                                            <SearchIcon />
                                        ),
                                        style: { marginBottom: '10px', width: '250px' }
                                    }}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={3}>
                            <div style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
                                <button className='addbtn' onClick={() => setAddSection(true)} style={{ height: '55px', width: '200px', backgroundColor: '#00ff1a2b', color: 'black', fontWeight: 'bold' }}>Add New Animal</button>
                            </div>
                        </Grid>
                    </Grid>

                )}
                {!addSection && !editSection && (
                    <div>
                        <ArrowBackIcon sx={{ marginTop: '-10px', cursor: 'pointer' }} onClick={handleClose} />
                    </div>
                )}

                <div className='form'>
                    {addSection && (
                        <ExamineAnimrForm
                            handleSubmit={handleSubmit}
                            handleOnChange={handleOnChange}
                            handleClose={() => setAddSection(false)}
                            rest={formData}
                        />
                    )}
                    {editSection && (
                        <ExamineAnimrForm
                            handleSubmit={() => handleUpdate(formDataEdit._id)}
                            handleOnChange={handleEditOnChange}
                            handleClose={() => setEditSection(false)}
                            rest={formDataEdit}
                        />
                    )}
                </div>
                {!addSection && !editSection && (
                    <div className='table' style={{
                        flex: 1,
                        padding: '10px',
                        margin: '50px ',
                        marginBottom: '20px',
                        marginTop: '-80px'

                    }}>

                        <CustomizedTables
                            headers={headers}
                            rows={filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(item => ({
                                "Ear Tag": item.earTag,
                                "Current Status": item.currentStatus,
                                "Examination": item.exam,
                                "Date": item.checkdate,
                                "Action": (
                                    <div>
                                        <IconButton onClick={() => handleEdit(item._id)} style={{ color: 'blue' }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(item._id)} style={{ color: 'red' }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                )
                            }))}
                        />

                        <TablePagination
                            rowsPerPageOptions={[1, 2, 5, 10, 25]}
                            component="div"
                            count={filteredData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>

                )}


            </div>
        </div>
    );
}

export default ExamineAnim;
