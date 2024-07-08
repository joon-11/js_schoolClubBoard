import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Styled components
const Container = styled.div`
  background-color: white;
  color: black;
  min-height: 100vh;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  max-width: 600px;
  margin: 0 auto;
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #f1f1f1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const UserItem = styled.li`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserColumn = styled.span`
  flex: 1;
  text-align: left;
  font-weight: bold;
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: darkred;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 18px;
  margin-top: 50px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 18px;
  margin-top: 50px;
  color: red;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

// UserSetting component
function UserSetting(props) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://localhost:7070/api/userLoad")
      .then((response) => {
        if (response.data.status === false) {
          setError("Failed to load users");
        } else {
          setUsers(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("An error occurred while fetching users");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("진짜 삭제 하시겠습니까?")) {
      axios
        .post("http://localhost:7070/api/deleteUser", { id })
        .then((response) => {
          if (response.data.status === false) {
            setError("Failed to delete user");
          } else {
            setUsers(users.filter((user) => user.id !== id));
          }
        })
        .catch((err) => {
          console.log(err);
          setError("An error occurred while deleting user");
        });
    }
  };

  const handleBack = () => {
    navigate(-1); // navigate back
  };

  const handleAuthKey = () => {
    // logic for setting auth key
    alert("인증키 설정 버튼 클릭됨");
  };

  if (loading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Title>User List</Title>
      <UserList>
        <UserHeader>
          <UserColumn>ID</UserColumn>
          <UserColumn>권한</UserColumn>
          <UserColumn>이름</UserColumn>
        </UserHeader>
        {users.map((user) => (
          <UserItem key={user.id}>
            <UserColumn>{user.id}</UserColumn>
            <UserColumn>{user.auth}</UserColumn>
            <UserColumn>{user.name}</UserColumn>
            <DeleteButton onClick={() => handleDelete(user.id)}>
              삭제
            </DeleteButton>
          </UserItem>
        ))}
      </UserList>
      <ButtonContainer>
        <ActionButton onClick={handleBack}>뒤로가기</ActionButton>
        <ActionButton onClick={handleAuthKey}>인증키 설정</ActionButton>
      </ButtonContainer>
    </Container>
  );
}

export default UserSetting;
