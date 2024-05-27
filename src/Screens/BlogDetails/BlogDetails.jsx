import React, { useEffect, useState } from 'react'
import './BlogDetails.css'
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const BlogDetails = ({setHeadTitle}) => {

    setHeadTitle('Blog Details')

    const { id } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
      const fetchBlog = async () => {
        try {
          const blogRef = doc(db, 'blogs', id);
          const docSnap = await getDoc(blogRef);
          if (docSnap.exists()) {
            setBlog({ id: docSnap.id, ...docSnap.data() });
          } else {
            console.error('Blog does not exist');
          }
        } catch (error) {
          console.error('Error fetching blog:', error);
        }
      };
      fetchBlog();
    }, [id]);


  return (
    <div className='blogDetails'>
        <div>Title: {blog.title}</div>
        <div>Slug: {blog.slug}</div>
        <div>Description: {blog.description}</div>
        <div>Summary: {blog.summary}</div>
        <div>Editor Discription: {blog.editorDescription}</div>
        <div>Is Featured: {blog.isFeatured}</div>
        <div>Featured Image: <img src={blog.image} alt="" /></div>
        <div>Description: {blog.description}</div>
        <div>Summary: {blog.summary}</div> 
    </div>
  )
}

export default BlogDetails