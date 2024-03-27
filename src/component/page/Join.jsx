import React from "react";
import styled from "styled-components";
import TextInput from "../ui/TextInput";

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

function Join(props) {
  // 회원가입 양식을 전송하는 함수 (임시로 alert으로 표시)
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("회원가입 정보를 전송합니다.");
    // 여기에 실제로 서버로 회원가입 정보를 전송하는 로직을 추가해야 합니다.
  };

  return (
    <FormContainer>
      <FormBox>
        <MainTitleText>회원가입</MainTitleText>
        {/* 회원가입 양식 */}
        <form onSubmit={handleSubmit}>
          <div>
            <FormLabel>이름</FormLabel>
            <TextInput
              height={20}
              type="text"
              placeholder="이름"
              style={{ padding: "8px" }}
            />
          </div>
          <div>
            <FormLabel>이메일</FormLabel>
            <TextInput
              height={20}
              type="email"
              placeholder="이메일"
              style={{ padding: "8px" }}
            />
          </div>
          <div>
            <FormLabel>비밀번호</FormLabel>
            <TextInput
              height={20}
              type="password"
              placeholder="비밀번호"
              style={{ padding: "8px" }}
            />
          </div>
          <SubmitButton type="submit">가입하기</SubmitButton>
        </form>
      </FormBox>
    </FormContainer>
  );
}

export default Join;
