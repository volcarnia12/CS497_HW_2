import express from 'express';
import logger from 'morgan';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const posts = {};
const censoredWords = ['fuck', 'shit', 'dumbass', 'retard']

app.get('/posts', (req, res) => {
    
  res.send(posts);
});

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
      const { id, content, postId } = data;
      let eligibility = 'ACCEPTED';
      for (let x = 0; x < censoredWords.length; ++x){
          let word = censoredWords[x];
          if (data.content.toLowerCase().includes(word)){
              eligibility = 'REJECTED';
              break;
          }
      }
      await axios.post('http://localhost:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        content: data.content,
        postId: data.postId, 
        status: eligibility
      },
    }).catch((err) => { console.log(err.message);});;
      //const post = posts[postId];
      //post.comments.push({ id, content });
    }

    //console.log(posts);
    res.send({ status: 'OK' });
  });

app.post('/events', (req, res) => {
  console.log(req.body.type);
  res.send({});
});

app.listen(4003, () => {
  console.log('Listening on port 4003');
});