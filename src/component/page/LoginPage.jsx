import { useState } from "react";
import styled from "styled-components";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  :not(:last-child) {
    margin-bottom: 16px;
  }
`;

const Wrapper = styled.div`
  padding: 16px;
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MainTitleText = styled.p`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px; /* 제목과 양식 사이 간격 추가 */
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const StyledButton = styled(Button)`
  height: 40px; /* Set the height of buttons */
`;

function Login(props) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (id === "" || pw === "") {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    let body = {
      id: id,
      pw: pw,
    };
    try {
      const response = await axios.post(
        "http://localhost:7070/api/login",
        body
      );

      const json = response.data;
      if (json.isLogin === "True") {
        alert("로그인 성공");
        navigate("/MainPage");
      } else {
        alert("로그인 실패: " + json.message);
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <Wrapper>
      <Container>
        <MainTitleText>로그인</MainTitleText>
        <TextInput
          height={20}
          placeholder="아이디"
          value={id}
          onChange={(event) => {
            setId(event.target.value);
          }}
        />
        <TextInput
          height={20}
          type="pw"
          placeholder="비밀번호"
          value={pw}
          onChange={(event) => {
            setPw(event.target.value);
          }}
        />
        <ButtonsContainer>
          <StyledButton title={"로그인"} onClick={handleLogin} />
          <StyledButton
            title={"회원가입"}
            onClick={() => {
              navigate("/Join");
            }}
          />
        </ButtonsContainer>
      </Container>
    </Wrapper>
  );
}

export default Login;
