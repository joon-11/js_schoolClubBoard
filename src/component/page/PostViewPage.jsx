import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import CommentList from "../list/CommentList";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";
import axios from "axios";

const Wrapper = styled.div`
  padding: 16px;
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 720px;

  :not(:last-child) {
    margin-bottom: 16px;
  }
`;

const PostContainer = styled.div`
  padding: 8px 16px;
  border: 1px solid grey;
  border-radius: 8px;
`;

const TitleText = styled.p`
  font-size: 28px;
  font-weight: 500;
`;

const ContentText = styled.p`
  font-size: 20px;
  line-height: 32px;
  white-space: pre-wrap;
`;

const CommentLabel = styled.p`
  font-size: 16px;
  font-weight: 500;
`;

const AuthorText = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #666;
`;

function PostViewPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null); // Initialize post state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7070/api/posts/${postId}`
        );
        setPost(response.data); // Update post state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [postId]); // Trigger useEffect when postId changes

  const [comment, setComment] = useState("");

  // Render components conditionally based on post
  return (
    <Wrapper>
      <Container>
        <Button
          title="뒤로 가기"
          onClick={() => {
            navigate("/MainPage");
          }}
        />
        {post && ( // Render only if post is not null or undefined
          <PostContainer>
            <TitleText>{post.title}</TitleText>
            {post.writer && <AuthorText>By: {post.writer}</AuthorText>}
            <ContentText>{post.contents}</ContentText>
          </PostContainer>
        )}

        <CommentLabel>댓글</CommentLabel>
        {post && post.comments ? (
          <CommentList comments={post.comments} />
        ) : (
          <p>댓글이 없습니다.</p>
        )}

        <TextInput
          height={40}
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
          }}
        />
        <Button
          title="댓글 작성하기"
          onClick={() => {
            navigate("/");
          }}
        />
      </Container>
    </Wrapper>
  );
}

export default PostViewPage;
