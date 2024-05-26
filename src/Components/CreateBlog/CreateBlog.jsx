import React, { useEffect, useState } from "react";
import "./CreateBlog.css";
import { Editor } from "@tinymce/tinymce-react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import author1 from "../../assets/images/author.png";
import { useNavigate } from "react-router-dom";
import {
  QuerySnapshot,
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const { mode, blogData } = window.location.state || {};
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState("");
  const [ifImage, setIfImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [author, setAuthor] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [seoImage, setSeoImage] = useState(null);
  const [seoImagePreview, setSeoImagePreview] = useState("");
  const [archive, setArchive] = useState([]);
  const [archiveOrUpload, setArchiveOrUpload] = useState("upload");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [tagSlug, setTagSlug] = useState("");
  const [tagDescription, setTagDescription] = useState("");
  const [authorDialogOpen, setAuthorDialogOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [authorSlug, setAuthorSlug] = useState("");
  const [authorDescription, setAuthorDescription] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [type, setType] = useState("image");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const categoriesSnapshot = await getDocs(collection(db, "categories"));
      setCategories(
        categoriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      const tagsSnapshot = await getDocs(collection(db, "tags"));
      setTags(tagsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const authorsSnapshot = await getDocs(collection(db, "authors"));
      setAuthors(
        authorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      const archiveSnapshot = await getDocs(collection(db, "archive"));
      setArchive(
        archiveSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    console.log("fetchDatauseeffect");

    fetchData();

    if (mode === "edit" && blogData) {
      setTitle(blogData.title);
      setSlug(blogData.slug);
      setSummary(blogData.summary);
      setDescription(blogData.description);
      setCategory(blogData.category);
      setSelectedTags(blogData.tags);
      setAuthor(blogData.seo.seoauthor);
      setSeoTitle(blogData.seo.title);
      setSeoDescription(blogData.seo.description);
      setSeoKeywords(blogData.seo.keywords);
      setImagePreview(blogData.image);
      setSeoImagePreview(blogData.seo.image);
    }
  }, [mode, blogData]);

  useEffect(() => {
    console.log("useEffectSLUG");
    setSlug(title.toLowerCase().replace(/ /g, "-"));
  }, [title]);

  useEffect(() => {
    console.log("useEffectCategorySlug");
    setCategorySlug(newCategory.toLowerCase().replace(/ /g, "-"));
  }, [newCategory]);

  useEffect(() => {
    console.log("useEffectTagSlug");
    setTagSlug(newTag.toLowerCase().replace(/ /g, "-"));
  }, [newTag]);

  useEffect(() => {
    console.log("useEffectAuthorSlug");
    setAuthorSlug(newAuthor.toLowerCase().replace(/ /g, "-"));
  }, [newAuthor]);

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const handleKeywordInputKeyPress = (event) => {
    if (event.key === "Enter" && keywordInput.trim()) {
      event.preventDefault();
      setSeoKeywords([...seoKeywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleDeleteKeyword = (keywordToDelete) => {
    setSeoKeywords(
      seoKeywords.filter((keyword) => keyword !== keywordToDelete)
    );
  };

  const handleImageArchiveChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const newArchiveItem = {
        Image: URL.createObjectURL(file),
      };
      setArchive([...archive, newArchiveItem]);
    }
  };

  const handleSetArchiveImage = (imageUrl) => {
    if (archiveOrUpload === "image") {
      setImagePreview(imageUrl);
    } else {
      setSeoImagePreview(imageUrl);
    }
    setOpenDialog(false);
  };

  const handleOpenDialog = (type) => {
    setType(type);
    setOpenDialog(true);
    setArchiveOrUpload(type);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === "") return;

    try {
      const categoriesRef = collection(db, "categories");
      const docRef = await addDoc(categoriesRef, {
        name: newCategory,
        slug: categorySlug,
        description: categoryDescription,
        createdAt: serverTimestamp(),
      });
      setCategories([
        ...categories,
        {
          id: docRef.id,
          name: newCategory,
          slug: categorySlug,
          description: categoryDescription,
        },
      ]);
      setNewCategory("");
      setCategorySlug("");
      setCategoryDescription("");
      setCategoryDialogOpen(false);
      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category. Please try again.");
    }
  };

  const handleAddTag = async () => {
    if (newTag.trim() === "") return;

    try {
      const tagsRef = collection(db, "tags");
      const docRef = await addDoc(tagsRef, {
        name: newTag,
        slug: tagSlug,
        description: tagDescription,
        createdAt: serverTimestamp(),
      });
      setTags([
        ...tags,
        {
          id: docRef.id,
          name: newTag,
          slug: tagSlug,
          description: tagDescription,
        },
      ]);
      setNewTag("");
      setTagSlug("");
      setTagDescription("");
      setTagDialogOpen(false);
      toast.success("Tag added successfully!");
    } catch (error) {
      console.error("Error adding tag:", error);
      toast.error("Error adding tag. Please try again.");
    }
  };

  const handleAddAuthor = async () => {
    if (newAuthor.trim() === "") return;

    try {
      const authorsRef = collection(db, "authors");
      const docRef = await addDoc(authorsRef, {
        name: newAuthor,
        slug: authorSlug,
        description: authorDescription,
        createdAt: serverTimestamp(),
      });
      setAuthors([
        ...authors,
        {
          id: docRef.id,
          name: newAuthor,
          slug: authorSlug,
          description: authorDescription,
        },
      ]);
      setNewAuthor("");
      setAuthorSlug("");
      setAuthorDescription("");
      setAuthorDialogOpen(false);
      toast.success("Author added successfully!");
    } catch (error) {
      console.error("Error adding author:", error);
      toast.error("Error adding author. Please try again.");
    }
  };


  // const fetchBlogs = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(db, "blogs"));
  //     const blogArray = [];
  //     querySnapshot.docs.map((doc) => {
  //       blogArray.push(doc.data());
  //       console.log(doc.data());
  //     });
  //     setBlogs(blogArray);
  //   } catch (error) {
  //     console.error("Error fetching collection: ", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchBlogs();
  // }, []);

  // console.log(blogs);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      console.log("error while storage");
      const imageRef = ref(
        storage,
        `uploads/images/featured/${Date.now()}-${
          image.name || imagePreview.name
        }`
      );
      const uploadResult = await uploadBytes(imageRef, image || imagePreview);
      const imageRef2 = ref(
        storage,
        `uploads/images/seo/${Date.now()}-${
          seoImage.name || seoImagePreview.name
        }`
      );
      const uploadResult2 = await uploadBytes(
        imageRef2,
        seoImage || seoImagePreview
      );
      console.log("error after storage");
      const blog = {
        title,
        slug,
        summary,
        description,
        category,
        image: imagePreview || image,
        imageUrl: uploadResult.ref.fullPath,
        seo: {
          title: seoTitle,
          description: seoDescription,
          image: seoImagePreview || seoImage,
          imageUrl: uploadResult2.ref.fullPath,
          keywords: seoKeywords,
          seoauthor: author,
        },
        tags: selectedTags,
        createdAt: serverTimestamp(),
      };

      if (mode === "edit") {
        const blogRef = doc(db, "blogs", blogData.id);
        await updateDoc(blogRef, blog);
        toast.success("Blog updated successfully!");
      } else {
        const blogsRef = collection(db, "blogs");
        await addDoc(blogsRef, blog);
        toast.success("Blog added successfully!");
      }
      navigate("/allblogs");
    } catch (error) {
      console.error("Error submitting blog:", error);
      toast.error("Error submitting blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createBlog">
      <form className="createBlogForm">
        <div>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ height: "9rem" }}
            />
          </div>
          <div>
            <label>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <label>Summary</label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={{ height: "9rem" }}
            />
          </div>
        </div>
        <div>
          <label>Is featured</label>
          <input
            type="text"
            value={isFeatured}
            onChange={(e) => setIsFeatured(e.target.value)}
          />
          <label>Featured Image</label>
          <Button color="success" onClick={() => handleOpenDialog("image")}>
            Upload Image
          </Button>
          {image && <Typography variant="body2">{image.name}</Typography>}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Blog"
              style={{ width: 200, height: 200, objectFit: "contain" }}
            />
          )}
        </div>
        <div className="editor">
          <Editor
            apiKey="z7gazwufigwwq500owylijq0vfodueg4e17noaid9895p4fi"
            initialValue={mode === "edit" ? blogData.description : ""}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | " +
                "bold italic underline strikethrough | " +
                "alignleft aligncenter alignright alignjustify | " +
                "outdent indent | " +
                "file edit view insert | " +
                "fontsizeselect | fontselect | " +
                "cut copy paste | " +
                "table | " +
                "forecolor backcolor | " +
                "link unlink | " +
                "image media | " +
                "fullscreen | help",
            }}
            onEditorChange={handleEditorChange}
          />
        </div>

        <div>
          <div>
            <label>Category</label>
            <Button onClick={() => setCategoryDialogOpen(true)}>
              Add Category
            </Button>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <div>
            <label>Tags</label>
            <Button onClick={() => setTagDialogOpen(true)}>Add Tag</Button>
          </div>
          <TextField
            style={{ width: "95%" }}
            fullWidth
            variant="outlined"
            select
            value={selectedTags}
            onChange={(e) => setSelectedTags(e.target.value)}
            SelectProps={{
              multiple: true,
              renderValue: (selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} sx={{ m: 0.5 }} />
                  ))}
                </Box>
              ),
            }}
            sx={{ mb: 2 }}
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.name}>
                {tag.name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className="seo">
          <label>Seo Data</label>
          <div className="seoTable">
            <label>SEO Title</label>
            <input type="text" />
            <label>SEO Description</label>
            <input type="text" />
            <div>
              <label>SEO Author</label>
              <Button onClick={() => setAuthorDialogOpen(true)}>
                Add Author
              </Button>
            </div>
            <select>
              {authors.map((auth) => (
                <option key={auth.id} value={auth.name}>
                  {auth.name}
                </option>
              ))}
            </select>
            <label>SEO Image</label>
            <Button
              style={{ width: "100%" }}
              color="success"
              onClick={() => handleOpenDialog("seoImage")}
            >
              Upload SEO Image
            </Button>
            {seoImage && (
              <Typography variant="body2">{seoImage.name}</Typography>
            )}
            {seoImagePreview && (
              <img
                src={seoImagePreview}
                alt="Blog"
                style={{ width: 200, height: 200, objectFit: "contain" }}
              />
            )}

            <label>SEO Keywords</label>
            <TextField
              style={{ width: "95%" }}
              fullWidth
              variant="outlined"
              type="text"
              label="SEO Keywords"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={handleKeywordInputKeyPress}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {seoKeywords.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                  onDelete={() => handleDeleteKeyword(keyword)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </div>
        </div>
        <button onClick={handleSubmit}>Create Blog</button>
      </form>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{
          height: "80%",
          width: "80%",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ p: 2 }}
        >
          <Button
            color="secondary"
            variant={archiveOrUpload === "upload" ? "contained" : "outlined"}
            onClick={() => setArchiveOrUpload("upload")}
          >
            Upload
          </Button>
          <Button
            color="secondary"
            variant={archiveOrUpload === "upload" ? "outlined" : "contained"}
            onClick={() => setArchiveOrUpload("archive")}
          >
            Archive
          </Button>
        </Box>

        {archiveOrUpload === "upload" ? (
          <label htmlFor="file-upload">
            <Box
              p={1}
              display="flex"
              justifyContent={"center"}
              alignItems={"center"}
              style={{ cursor: "pointer", width: 200, height: 200 }}
            >
              <CloudUploadIcon />
              <Typography
                ml={1}
                mt={1}
                variant="h5"
                gutterBottom
                style={{ cursor: "pointer" }}
              >
                Upload
              </Typography>
              <input
                id="file-upload"
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => {
                  if (type === "image") {
                    setImage(e.target.files[0]);
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  } else {
                    setSeoImage(e.target.files[0]);
                    setSeoImagePreview(URL.createObjectURL(e.target.files[0]));
                  }
                  setOpenDialog(false);
                }}
              />
            </Box>
          </label>
        ) : (
          <Box
            p={2}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexWrap={"wrap"}
          >
            <label htmlFor="file-archive-upload">
              <Paper sx={{ p: 2, m: 1, cursor: "pointer" }}>
                <img
                  src={author1}
                  alt="Archive"
                  style={{
                    width: 200,
                    height: 200,
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                  }}
                />
                <input
                  id="file-archive-upload"
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageArchiveChange}
                />
              </Paper>
            </label>
            {archive.map((item, index) => (
              <Paper
                key={index}
                sx={{ p: 2, m: 1, cursor: "pointer" }}
                onClick={() => {
                  handleSetArchiveImage(item.Image);
                }}
              >
                <img
                  src={item.Image}
                  alt="Archive"
                  style={{
                    width: 200,
                    height: 200,
                    objectFit: "contain",
                  }}
                />
              </Paper>
            ))}
          </Box>
        )}
      </Dialog>

      <Dialog open={tagDialogOpen} onClose={() => setTagDialogOpen(false)}>
        <DialogTitle>Add New Tag</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="filled"
            label="New Tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Slug"
            value={tagSlug}
            onChange={(e) => setTagSlug(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Description"
            value={tagDescription}
            onChange={(e) => setTagDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTagDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddTag} color="secondary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
      >
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="filled"
            label="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Slug"
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Description"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCategoryDialogOpen(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="secondary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={authorDialogOpen}
        onClose={() => setAuthorDialogOpen(false)}
      >
        <DialogTitle>Add New Author</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="filled"
            label="New Author"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Slug"
            value={authorSlug}
            onChange={(e) => setAuthorSlug(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Description"
            value={authorDescription}
            onChange={(e) => setAuthorDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuthorDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddAuthor} color="secondary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{
          height: "80%",
          width: "80%",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ p: 2 }}
        >
          <Button
            color="secondary"
            variant={archiveOrUpload === "upload" ? "contained" : "outlined"}
            onClick={() => setArchiveOrUpload("upload")}
          >
            Upload
          </Button>
          <Button
            color="secondary"
            variant={archiveOrUpload === "upload" ? "outlined" : "contained"}
            onClick={() => setArchiveOrUpload("archive")}
          >
            Archive
          </Button>
        </Box>

        {archiveOrUpload === "upload" ? (
          <label htmlFor="file-upload">
            <Box
              p={1}
              display="flex"
              justifyContent={"center"}
              alignItems={"center"}
              style={{ cursor: "pointer", width: 200, height: 200 }}
            >
              <CloudUploadIcon />
              <Typography
                ml={1}
                mt={1}
                variant="h5"
                gutterBottom
                style={{ cursor: "pointer" }}
              >
                Upload
              </Typography>
              <input
                id="file-upload"
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => {
                  if (type === "image") {
                    setImage(e.target.files[0]);
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  } else {
                    setSeoImage(e.target.files[0]);
                    setSeoImagePreview(URL.createObjectURL(e.target.files[0]));
                  }
                  setOpenDialog(false);
                }}
              />
            </Box>
          </label>
        ) : (
          <Box
            p={2}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexWrap={"wrap"}
          >
            <label htmlFor="file-archive-upload">
              <Paper sx={{ p: 2, m: 1, cursor: "pointer" }}>
                <img
                  src={author1}
                  alt="Archive"
                  style={{
                    width: 200,
                    height: 200,
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                  }}
                />
                <input
                  id="file-archive-upload"
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageArchiveChange}
                />
              </Paper>
            </label>
            {archive.map((item, index) => (
              <Paper
                key={index}
                sx={{ p: 2, m: 1, cursor: "pointer" }}
                onClick={() => {
                  handleSetArchiveImage(item.Image);
                }}
              >
                <img
                  src={item.Image}
                  alt="Archive"
                  style={{ width: 200, height: 200, objectFit: "contain" }}
                />
              </Paper>
            ))}
          </Box>
        )}
      </Dialog>
    </div>
  );
};

export default CreateBlog;