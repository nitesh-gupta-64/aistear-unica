import React, { useEffect, useState } from "react";
import SearchBar from "../../Components/SearchBar/SearchBar";
import "./ShowBlogs.css";
import { Button } from "@mui/material";
import { db } from "../../firebase/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ShowBlogs = ({ setHeadTitle, query, setQuery }) => {
  setHeadTitle("Show Blogs");

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const blogsRef = collection(db, "blogs");
      const querySnapshot = await getDocs(blogsRef);
      const blogsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching blogs... useEffect all blogs page");
    fetchBlogs();
  }, []);

  const handleSearch = (event) => {
    setQuery(event.target.value);
    setPage(0);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleSelectRow = (id) => {
    console.log(id);
    setSelectedBlogs((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    console.log(selectedBlogs);
  }, [selectedBlogs]);

  const handleDeleteSelected = () => {
    selectedBlogs.forEach(async (id) => {
      try {
        await deleteDoc(doc(db, "blogs", id));
        toast.success("Blog deleted successfully!");
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast.error("Error deleting blog. Please try again.");
      }
    });
    setBlogs((prevBlogs) =>
      prevBlogs.filter((blog) => !selectedBlogs.includes(blog.id))
    );
    setSelectedBlogs([]);
  };

  const handleViewBlog = () => {
    navigate(`/blog/${selectedBlogs[0]}`);
  };

  const addBlog = () => {
    navigate('/createblog')
  }

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="showBlogs">
      <SearchBar onChange={handleSearch} query={query} setQuery={setQuery} />
      <div className="buttonLayout">
      <Button
          variant="outlined"
          onClick={addBlog}
        >
          Add Blog
        </Button>
        <Button
          variant="outlined"
          className="view-button"
          onClick={handleViewBlog}
          disabled={selectedBlogs.length !== 1}
        >
          View
        </Button>
        <Button
          variant="outlined"
          className="delete-button"
          onClick={handleDeleteSelected}
          disabled={selectedBlogs.length === 0}
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
            <th>View Tags</th>
          </tr>
        </thead>
        <tbody>
          {filteredBlogs
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((blog, index) => (
              <tr key={blog.id}>
                <td data-label="Select">
                  <input
                    type="checkbox"
                    checked={selectedBlogs.includes(blog.id)}
                    onChange={() => handleSelectRow(blog.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{blog.title}</td>
                <td>{blog.slug}</td>
                <td>{blog.description}</td>
                <td></td>
                <td>
                  {blog.tags.map((tag) => (
                    <p>{tag}</p>
                  ))}
                </td>
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
          disabled={page >= Math.ceil(filteredBlogs.length / rowsPerPage) - 1}
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
export default ShowBlogs;
