import React, { useState, useEffect } from "react";
import "./Categories.css";
import { Button } from "@mui/material";
import { db } from "../../firebase/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Categories = ({ setHeadTitle }) => {
  setHeadTitle("Categories");

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const categoriesRef = collection(db, "categories");
      const querySnapshot = await getDocs(categoriesRef);
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching categories... useEffect all categories page");
    fetchCategories();
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
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = () => {
    selectedCategories.forEach(async (id) => {
      try {
        await deleteDoc(doc(db, "categories", id));
        toast.success("Category deleted successfully!");
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Error deleting category. Please try again.");
      }
    });
    setCategories((prevCategories) =>
      prevCategories.filter((category) => !selectedCategories.includes(category.id))
    );
    setSelectedCategories([]);
  };

  const handleViewCategory = () => {
    navigate(`/category/${selectedCategories[0]}`);
  };

  const addCategory = () => {
    navigate("/createcategory");
  };

  return (
    <div className="showCategories">
      <div className="buttonLayout">
        <Button variant="outlined" onClick={addCategory}>
          Add Category
        </Button>
        <Button
          variant="outlined"
          className="view-button"
          onClick={handleViewCategory}
          disabled={selectedCategories.length !== 1}
        >
          View
        </Button>
        <Button
          variant="outlined"
          className="delete-button"
          onClick={handleDeleteSelected}
          disabled={selectedCategories.length === 0}
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
          {categories
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((category, index) => (
              <tr key={category.id}>
                <td data-label="Select">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleSelectRow(category.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.description}</td>
                {new Date(category.createdAt.toDate()).toLocaleString() && (
                  <td>{new Date(category.createdAt.toDate()).toLocaleString()}</td>
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
          disabled={page >= Math.ceil(categories.length / rowsPerPage) - 1}
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

export default Categories;
