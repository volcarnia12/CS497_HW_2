import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts); 
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;
    const post = posts[postId];
    post.comments.push({ id, postId, content, status: 'under_review', upvote: 0, downvote: 0 });
  }

  if (type === 'CommentModerated'){
    const { id, content, postId, status } = data;
    const post = posts[postId]; 
    for (let x = 0; x < post.comments.length; ++x){
      if (post.comments[x].id === id){
        post.comments[x].status = status;
      }
    }
  }

  if (type === 'CommentVoted'){
    const { id, postId, voteType } = data;
    const post = posts[postId];
    for (let x = 0; x < post.comments.length; ++x){
      if (post.comments[x].id === id){
        //post.comments[x].upvote = 1;
        if (voteType === 1){
          post.comments[x].upvote = post.comments[x].upvote + 1;
          break;
        }
        else{
          post.comments[x].downvote = post.comments[x].downvote + 1;
          break;
        }
      }
    }
  }

  console.log(posts);

  res.send({ status: 'OK' });
});

app.listen(4002, () => {
  console.log('Listening on 4002');
});
