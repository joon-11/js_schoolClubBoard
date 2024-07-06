import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const MainTitleText = styled.p`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

function PostWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:7070/api/write",
        {
          title,
          contents: content,
        },
        { withCredentials: true }
      );

      if (response.data.status) {
        alert("글 작성이 완료되었습니다.");
        navigate("/MainPage");
      } else {
        alert("글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("글 작성 중 오류가 발생했습니다.", error);
      alert("글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <Wrapper>
      <Container>
        <MainTitleText>게시판</MainTitleText>
        <TextInput
          height={20}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <TextInput
          height={480}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <Button title="글 작성하기" onClick={handleSubmit} />
      </Container>
    </Wrapper>
  );
}

export default PostWritePage;
