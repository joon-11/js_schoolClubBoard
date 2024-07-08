import React, { useState, useEffect } from "react";
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

const AuthKeyContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AuthKeySection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Label = styled.label`
  flex: 1;
  font-weight: bold;
  margin-right: 10px;
`;

const Input = styled.input`
  flex: 2;
  padding: 8px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const RefreshButton = styled.button`
  flex: 0;
  padding: 8px 12px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
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

const AuthKeyComponent = () => {
  const [authKey, setAuthKey] = useState("");
  const [TauthKey, setTauthKey] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAuthKeys = async () => {
    try {
      const response = await axios.post("http://localhost:7070/api/getAuth");
      if (response.data.status) {
        setAuthKey(response.data.result[0].authKey);
        setTauthKey(response.data.result[0].Tauthkey);
      } else {
        setError("Failed to fetch auth keys");
      }
    } catch (error) {
      setError("An error occurred while fetching auth keys");
    }
  };

  useEffect(() => {
    fetchAuthKeys();
  }, []);

  const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 12);
  };

  const handleRefresh = async () => {
    const newAuthKey = generateRandomString();
    const newTauthKey = generateRandomString();

    try {
      await axios.post("http://localhost:7070/api/authRefresh", {
        authKey: newAuthKey,
        TauthKey: newTauthKey,
      });
      setAuthKey(newAuthKey);
      setTauthKey(newTauthKey);
    } catch (error) {
      console.error("Error refreshing auth keys:", error);
      setError("Failed to refresh auth keys");
    }
  };

  const handleBack = () => {
    navigate(-1); // navigate back
  };

  return (
    <Container>
      <Title>인증키</Title>
      <AuthKeyContainer>
        <AuthKeySection>
          <Label htmlFor="authKey">학생 인증키:</Label>
          <Input type="text" id="authKey" value={authKey} readOnly />
          <RefreshButton onClick={handleRefresh}>Refresh</RefreshButton>
        </AuthKeySection>
        <AuthKeySection>
          <Label htmlFor="TauthKey">선생님 인증키:</Label>
          <Input type="text" id="TauthKey" value={TauthKey} readOnly />
          <RefreshButton onClick={handleRefresh}>Refresh</RefreshButton>
        </AuthKeySection>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </AuthKeyContainer>
      <ButtonContainer>
        <ActionButton onClick={handleBack}>뒤로가기</ActionButton>
      </ButtonContainer>
    </Container>
  );
};

export default AuthKeyComponent;
