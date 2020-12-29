import React, { useState } from "react";
import { Button, Icon, Confirm, Popup } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";

import { FETCH_POSTS_QUERY } from "../common/utils/graphql";

const DeleteButton = ({ postID, commentID, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentID ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);

      if (!commentID) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        const newData = {
          getPosts: data.getPosts.filter((post) => post.id !== postID),
        };
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData });
      }

      if (callback) callback();
    },
    variables: {
      postID,
      commentID,
    },
  });

  return (
    <>
      <Popup
        content={commentID ? "Delete comment" : "Delete post"}
        inverted
        trigger={
          <Button
            as="div"
            color="red"
            floated="right"
            style={{ padding: 10 }}
            onClick={() => setConfirmOpen(true)}
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        }
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postID: ID!) {
    deletePost(postID: $postID)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postID: ID!, $commentID: ID!) {
    deleteComment(postID: $postID, commentID: $commentID) {
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

export default DeleteButton;
