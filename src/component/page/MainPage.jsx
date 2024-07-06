import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../ui/Button";
import PostList from "../list/PostList";
import { useNavigate } from "react-router-dom";
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

const NoPostsText = styled.p`
  font-size: 18px;
  text-align: center;
  color: #999;
`;

function MainPage(props) {
  const [titles, setTitles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:7070/api/loadMain");
        setTitles(response.data.result || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setTitles([]); // Set titles to an empty array in case of error
      }
    };

    fetchData();
  }, []);

  return (
    <Wrapper>
      <Container>
        <MainTitleText>게시판</MainTitleText>
        <Button
          title="글 작성하기"
          onClick={() => {
            navigate("/post-write");
          }}
        />
        {titles && titles.length > 0 ? (
          <PostList
            posts={titles.map((post) => ({
              id: post.board_id,
              title: post.title,
            }))}
            onClickItem={(item) => {
              console.log(item.id);
              navigate("/post/" + item.id);
            }}
          />
        ) : (
          <NoPostsText>게시물이 없습니다</NoPostsText>
        )}
      </Container>
    </Wrapper>
  );
}

export default MainPage;
