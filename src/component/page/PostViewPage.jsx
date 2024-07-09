import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
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

const CommentItem = styled.div`
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const CommentWriter = styled.p`
  font-size: 14px;
  font-weight: bold;
`;

const CommentText = styled.p`
  font-size: 14px;
`;

function PostViewPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7070/api/posts/${postId}`
        );
        setPost(response.data.result);
        setComments(response.data.comments);
        setUserRoles(response.data.roles); // Update user roles
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:7070/api/posts/${postId}`
      );
      if (response.data.status) {
        navigate("/MainPage");
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error("게시물 삭제 중 오류 발생:", error);
    }
  };

  return (
    <Wrapper>
      <Container>
        <Button
          title="뒤로 가기"
          onClick={() => {
            navigate("/MainPage");
          }}
        />
        {userRoles.includes("teacher") && (
          <Button title="삭제하기" onClick={handleDelete} />
        )}
        {post && (
          <PostContainer>
            <TitleText>{post.title}</TitleText>
            {post.writer && <AuthorText>By: {post.writer}</AuthorText>}
            <ContentText>{post.contents}</ContentText>
          </PostContainer>
        )}

        <CommentLabel>댓글</CommentLabel>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <CommentItem key={index}>
              <CommentWriter>{comment.comment_writer}</CommentWriter>
              <CommentText>{comment.comment}</CommentText>
            </CommentItem>
          ))
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
          onClick={async () => {
            try {
              const response = await axios.post(
                "http://localhost:7070/api/comments",
                {
                  postId: postId,
                  comment: comment,
                }
              );
              if (response.data.status) {
                // 댓글이 성공적으로 작성되면, 댓글 목록을 업데이트합니다.
                setComments([
                  ...comments,
                  { comment_writer: response.data.comment_writer, comment },
                ]);
                setComment(""); // 댓글 입력 필드를 초기화합니다.
              } else {
                console.error(response.data.error);
              }
            } catch (error) {
              console.error("댓글 작성 중 오류 발생:", error);
            }
          }}
        />
      </Container>
    </Wrapper>
  );
}

export default PostViewPage;
