import React, { useContext } from "react";
import { Button, Card, Icon, Label, Image, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

const PostCard = ({
  post: {
    id,
    body,
    username,
    createdAt,
    comments,
    commentCount,
    likes,
    likeCount,
  },
}) => {
  const { user } = useContext(AuthContext);

  const handleCommentPost = () => {
    console.log("commented");
  };

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />

        <Popup
          content="Comment on post"
          inverted
          trigger={
            <Button
              labelPosition="right"
              onClick={handleCommentPost}
              as={Link}
              to={`/posts/${id}`}
            >
              <Button color="teal" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="teal" pointing="left">
                {commentCount}
              </Label>
            </Button>
          }
        />
        {user && user.username === username && <DeleteButton postID={id} />}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
