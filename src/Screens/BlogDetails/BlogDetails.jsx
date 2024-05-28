import React, { useEffect, useState } from "react";
import "./BlogDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Button } from "@mui/material";

const BlogDetails = ({ setHeadTitle }) => {
  setHeadTitle("Blog Details");

  const navigate = useNavigate();

  const { id } = useParams();
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogRef = doc(db, "blogs", id);
        const docSnap = await getDoc(blogRef);
        setBlog({ id: docSnap.id, ...docSnap.data() });
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    fetchBlog();
  }, [id]);

  const handleClose = () => {
    navigate("/showblog");
  };

  return (
    <div className="blogDetails">
      <div>Title: {blog.title}</div>
      <div>Slug: {blog.slug}</div>
      <div>Description: {blog.description}</div>
      <div>Summary: {blog.summary}</div>
      <div>Editor Discription: {blog.editorDescription}</div>
      <div>Is Featured: {blog.isFeatured}</div>
      <div>Featured Image:</div>
      <img width="200px" src={blog.image} alt="" />
      <div>Category: {blog.category}</div>
      <div>Tags:  {blog.tags && blog.tags.map((tag) => (<span style={{marginLeft: '0.6rem'}}>{tag}</span>))}</div>
      <div>SEO Data</div>
      {blog.seo && (
        <div className="seoData">
          <div>SEO Title: {blog.seo.title}</div>
          <div>SEO Description: {blog.seo.description}</div>
          <div>SEO Author: {blog.seo.seoauthor}</div>
          <div>SEO Image:</div>
          <img width="200px" src={blog.seo.image} alt="" />
          <div>
            SEO Keywords:  
            {blog.seo.keywords &&
              blog.seo.keywords.map((keyword) => <span style={{marginLeft: '0.6rem'}}>{keyword}</span>)}
          </div>
        </div>
      )}
      <Button onClick={handleClose}>close</Button>
    </div>
  );
};

export default BlogDetails;
