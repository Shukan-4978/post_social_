import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Typography, CircularProgress, Box, Alert } from '@mui/material';
import api from '../services/api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      setError('Could not load the feed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  return (
    <Container style={{ maxWidth: 600, paddingTop: 24, paddingBottom: 40 }}>
      <CreatePost onPostCreated={handlePostCreated} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
          No posts yet. Be the first to share something!
        </Typography>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />)
      )}
    </Container>
  );
};

export default Feed;
