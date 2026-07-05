import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  TextField,
  Button,
  Divider,
  Avatar
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = post.likes.includes(user?.id);


  const handleLike = async () => {
    const res = await api.put(`/posts/${post._id}/like`);
    onUpdate(res.data);
  };

const handleComment = async (e) => {
  e.preventDefault();

  if (!commentText.trim()) return;

  try {
    const res = await api.post(
      `/posts/${post._id}/comment`,
      { text: commentText }
    );

    onUpdate(res.data);
    setCommentText('');
  } catch (err) {
    console.log("FULL ERROR:", err);
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);
    console.log("MESSAGE:", err.message);
  }
};

  return (
    
    <Card sx={{ mb: 3 }}>
      {post.image && (
        <CardMedia
          component="img"
          image={`${API_BASE_URL}${post.image}`}
          alt="post"
          sx={{ maxHeight: 420, objectFit: 'cover' }}
        />
        
      )}

      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>{post.username[0].toUpperCase()}</Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {post.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {post.text && (
          <Typography variant="body1" sx={{ mb: 1.5, whiteSpace: 'pre-wrap' }}>
            {post.text}
          </Typography>
        )}

        <Divider sx={{ mb: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton onClick={handleLike} color={isLiked ? 'error' : 'default'}>
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
          </Typography>

          <IconButton onClick={() => setShowComments((prev) => !prev)}>
            <ChatOutlinedIcon />
          </IconButton>
          <Typography variant="body2">
  {post?.comments?.length || 0}{' '}
  {(post?.comments?.length || 0) === 1 ? 'comment' : 'comments'}
</Typography>
        </Box>

        {showComments && (
          <Box sx={{ mt: 1.5 }}>
            <Divider sx={{ mb: 1.5 }} />

            {post?.comments?.map((c, i) => (
              <Box key={i} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>{c.username}</strong> {c.text}
                </Typography>
              </Box>
            ))}

            <Box component="form" onSubmit={handleComment} sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button type="submit" variant="outlined">
                Send
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
