import React, { useContext, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Grid,
  Image,
  Card,
  Button,
  Icon,
  Label,
  Form,
  Popup,
} from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../components/LikeButton";

import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";

const SinglePost = (props) => {
  const postID = props.match.params.postID;
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
    },
    variables: {
      postID,
      body: comment,
    },
  });

  const { loading, data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postID,
    },
  });

  const handleDeletePost = () => {
    props.history.push("/");
  };

  let postMarkup;
  if (loading) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const getPost = data?.getPost;

    const {
      id,
      body,
      username,
      createdAt,
      comments,
      commentCount,
      likes,
      likeCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Popup
                  content="Comment on post"
                  inverted
                  trigger={
                    <Button
                      as="div"
                      labelPosition="right"
                      onClick={() => console.log("Comment on post")}
                    >
                      <Button basic color="teal">
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="teal" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  }
                />
                {user && user.username === username && (
                  <DeleteButton postID={id} callback={handleDeletePost} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postID={id} commentID={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};

const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment($postID: ID!, $body: String!) {
    createComment(postID: $postID, body: $body) {
      id
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postID: ID!) {
    getPost(postID: $postID) {
      id
      body
      username
      createdAt
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default SinglePost;
