import express from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const comments = {};

app.post('/posts/votes', async (req, res) => {
    //const id = randomBytes(4).toString('hex');
    const { id, postId, voteType } = req.body; 
    // maybe have a typeVote where 1 = upvote and 0 = downvote
    comments[id] = {
      id,
      postId,
      voteType
    };
  
    await axios.post('http://localhost:4005/events', {
      type: 'CommentVoted',
      data: {
        id,
        postId,
        voteType
      },
    });
  
    res.status(201).send(comments[id]);
  });

  app.listen(4004, () => {
    console.log('Listening on port 4004');
  });