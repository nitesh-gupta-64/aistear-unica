import React, { useState, useEffect } from "react";
import "./Tags.css";
import { Button } from "@mui/material";
import { db } from "../../firebase/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Tags = ({ setHeadTitle }) => {
  setHeadTitle("Tags");

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  const fetchTags = async () => {
    try {
      const tagsRef = collection(db, "tags");
      const querySnapshot = await getDocs(tagsRef);
      const tagsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTags(tagsData);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching tags... useEffect all tags page");
    fetchTags();
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleSelectRow = (id) => {
    console.log(id);
    setSelectedTags((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = () => {
    selectedTags.forEach(async (id) => {
      try {
        await deleteDoc(doc(db, "tags", id));
        toast.success("Tag deleted successfully!");
      } catch (error) {
        console.error("Error deleting tag:", error);
        toast.error("Error deleting tag. Please try again.");
      }
    });
    setTags((prevTags) =>
      prevTags.filter((tag) => !selectedTags.includes(tag.id))
    );
    setSelectedTags([]);
  };

  const handleViewTag = () => {
    navigate(`/tag/${selectedTags[0]}`);
  };

  const addTag = () => {
    navigate("/createtag");
  };

  return (
    <div className="showTags">
      <div className="buttonLayout">
        <Button variant="outlined" onClick={addTag}>
          Add Tag
        </Button>
        <Button
          variant="outlined"
          className="view-button"
          onClick={handleViewTag}
          disabled={selectedTags.length !== 1}
        >
          View
        </Button>
        <Button
          variant="outlined"
          className="delete-button"
          onClick={handleDeleteSelected}
          disabled={selectedTags.length === 0}
        >
          Delete
        </Button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th></th>
            <th>#</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Description</th>
            <th>Created at</th>
          </tr>
        </thead>
        <tbody>
          {tags
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((tag, index) => (
              <tr key={tag.id}>
                <td data-label="Select">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleSelectRow(tag.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{tag.name}</td>
                <td>{tag.slug}</td>
                <td>{tag.description}</td>
                {new Date(tag.createdAt.toDate()).toLocaleString() && (
                  <td>{new Date(tag.createdAt.toDate()).toLocaleString()}</td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="pagination">
        <Button
          onClick={() => handleChangePage(page - 1)}
          disabled={page === 0}
          variant="outlined"
        >
          Previous
        </Button>
        <Button
          onClick={() => handleChangePage(page + 1)}
          disabled={page >= Math.ceil(tags.length / rowsPerPage) - 1}
          variant="outlined"
        >
          Next
        </Button>
        <select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
          {[5, 10, 25, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Tags;
