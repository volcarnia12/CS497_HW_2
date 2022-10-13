import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ comments }) => {
  async function upVote(comment){
    window.location.reload();
    await axios.post('http://localhost:4004/posts/votes', {
        id: comment.id,
        postId: comment.postId,
        voteType: 1
    }).catch((err) => { console.log(err.message); })
  };

  async function downVote(comment){
    window.location.reload();
    await axios.post('http://localhost:4004/posts/votes', {
        id: comment.id,
        postId: comment.postId,
        voteType: 0
    }).catch((err) => { console.log(err.message);});
  }

  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{comment.content} <br/> 
    Status: {comment.status} <br/> Upvotes: {comment.upvote} <br/> Downvotes: {comment.downvote} <br/>
    <button className="btn btn-primary" onClick={()=> upVote(comment)}>Upvote</button>
    <button className="btn btn-primary" onClick={()=> downVote(comment)} >Downvote</button>
    </li>;
  });

  console.log(comments);

  return <ul>{renderedComments}
  </ul>;
};

export default CommentList;
