import React from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";

import { useForm } from "../common/hooks/useForm";
import { FETCH_POSTS_QUERY } from "../common/utils/graphql";

const PostForm = () => {
  const { values, handleOnChange, handleOnSubmit } = useForm(
    createPostCallback,
    { body: "" }
  );

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [result.data.createPost, ...data.getPosts] },
      });
      values.body = "";
    },
    onError(err) {
      console.log(err);
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={handleOnSubmit}>
        <h2>Create Post</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hello World!"
            name="body"
            value={values.body}
            onChange={handleOnChange}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Create Post
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
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
        createdAt
      }
      likeCount
    }
  }
`;

export default PostForm;
