import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../ui/Button";
import PostList from "../list/PostList";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  button {
    height: 40px; /* Adjust height as needed */
    width: 150px; /* Adjust width as needed to ensure consistency */
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
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:7070/api/loadMain");
        setTitles(response.data.result || []);
        setRoles(response.data.roles || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setTitles([]);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (confirmLogout) {
      try {
        await axios.post("http://localhost:7070/api/logout");
        navigate("/");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };

  console.log(roles);

  return (
    <Wrapper>
      <Container>
        <MainTitleText>게시판</MainTitleText>
        <ButtonContainer>
          <Button
            title="글 작성하기"
            onClick={() => {
              navigate("/post-write");
            }}
          />
          {roles.includes("teacher") && (
            <Button
              title="사용자 설정"
              onClick={() => {
                navigate("/user-settings");
              }}
            />
          )}
          <Button title="로그아웃" onClick={handleLogout} />
        </ButtonContainer>
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
