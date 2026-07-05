import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Box, Avatar, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !image) {
      setError('Write something or add an image to post');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('text', text);
      if (image) {formData.append('image', image);}

      const res = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setText('');
      removeImage();
      onPostCreated(res.data);
    } catch (err) {
  console.log("Status:", err.response?.status);
  console.log("Backend Error:", err.response?.data);

  setError(
    err.response?.data?.message ||
    err.response?.data?.error ||
    'Failed to create post'
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>{user?.username?.[0]?.toUpperCase()}</Avatar>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder={`What's on your mind, ${user?.username}?`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Box>

        {preview && (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <img
              src={preview}
              alt="preview"
              style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8 }}
            />
            <Button
              size="small"
              onClick={removeImage}
              sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}
            >
              Remove
            </Button>
          </Box>
        )}

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button component="label" startIcon={<ImageIcon />}>
            Add Image
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>

          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
