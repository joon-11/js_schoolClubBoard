import React from "react";
import styled from "styled-components";
import Button from "../ui/Button";
import data from "../../data.json";
import PostList from "../list/PostList";
import { useNavigate } from "react-router-dom";

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

function MainPage(props) {
  const navigetor = useNavigate();

  return (
    <Wrapper>
      <Container>
        <MainTitleText>게시판</MainTitleText>
        <Button
          title="글 작성하기"
          onClick={() => {
            navigetor("/post-write");
          }}
        />
        <PostList
          posts={data}
          onClickItem={(item) => {
            navigetor("/post/" + item.id);
          }}
        />
      </Container>
    </Wrapper>
  );
}

export default MainPage;
