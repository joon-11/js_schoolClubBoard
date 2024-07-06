import React from "react";
import styled from "styled-components";
import TextInput from "../ui/TextInput";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 제목 스타일링
const MainTitleText = styled.p`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px; /* 제목과 양식 사이 간격 추가 */
`;

// 전체 양식을 감싸는 컨테이너 스타일링
const FormContainer = styled.div`
  max-width: 400px; /* 양식의 최대 너비 지정 */
  margin: 0 auto; /* 가운데 정렬 */
`;

// 양식 전체를 감싸는 박스 스타일링
const FormBox = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 추가 */
`;

// 양식 라벨 스타일링
const FormLabel = styled.label`
  margin-bottom: 6px; /* 라벨 아래 간격 추가 */
  display: block; /* 라벨을 블록 요소로 설정하여 한 줄에 하나씩 표시 */
`;

// 버튼 스타일링
const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

// 라디오 버튼 컨테이너 스타일링
const RadioContainer = styled.div`
  display: flex;
  gap: 20px; /* 간격 줄이기 */
  margin-bottom: 10px;
`;

function Join(props) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [auth, setAuth] = useState("");
  const [name, setName] = useState("");
  const [authKey, setAuthKey] = useState(""); // 인증키 상태 추가
  const navigate = useNavigate();

  // 유효성 검사 함수
  const validateForm = () => {
    if (
      id === "" ||
      pw === "" ||
      name === "" ||
      auth === "" ||
      authKey === ""
    ) {
      alert("모든 필드를 작성해주세요.");
      return false;
    }
    return true;
  };

  // 회원가입 양식을 전송하는 함수
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let body = {
      id: id,
      pw: pw,
      name: name,
      auth: auth,
      authKey: authKey, // 인증키 추가
    };

    try {
      axios.post("http://localhost:7070/api/signIn", body).then((res) => {
        const json = res.data; // 응답 데이터에 접근합니다.
        if (json.isSign === "True") {
          alert("회원가입 성공");
          navigate("/");
        } else {
          alert(json.isSign);
        }
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    alert("회원가입 정보를 전송합니다.");
  };

  return (
    <FormContainer>
      <FormBox>
        <MainTitleText>회원가입</MainTitleText>
        {/* 회원가입 양식 */}
        <form onSubmit={handleSubmit}>
          <div>
            <FormLabel>아이디</FormLabel>
            <TextInput
              height={20}
              type="id"
              placeholder="id"
              style={{ padding: "8px" }}
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div>
            <FormLabel>이름</FormLabel>
            <TextInput
              height={20}
              placeholder="name"
              style={{ padding: "8px" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <FormLabel>비밀번호</FormLabel>
            <TextInput
              height={20}
              type="password"
              placeholder="password"
              style={{ padding: "8px" }}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <div>
            <FormLabel>사용자 유형</FormLabel>
            <RadioContainer>
              <div>
                <input
                  type="radio"
                  id="student"
                  name="auth"
                  value="student"
                  checked={auth === "student"}
                  onChange={(e) => setAuth(e.target.value)}
                />
                <label htmlFor="student">학생</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="teacher"
                  name="auth"
                  value="teacher"
                  checked={auth === "teacher"}
                  onChange={(e) => setAuth(e.target.value)}
                />
                <label htmlFor="teacher">선생</label>
              </div>
            </RadioContainer>
          </div>
          <div>
            <FormLabel>인증키</FormLabel>
            <TextInput
              height={20}
              placeholder="auth key"
              style={{ padding: "8px" }}
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
            />
          </div>

          <SubmitButton type="submit">가입하기</SubmitButton>
        </form>
      </FormBox>
    </FormContainer>
  );
}

export default Join;
