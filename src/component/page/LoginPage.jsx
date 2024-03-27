import { useState } from "react";
import styled from "styled-components";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";
import MainPage from "./MainPage";
import { useNavigate } from "react-router-dom";
import App from "../../App";

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
  gap: 8px;
`;

const StyledButton = styled(Button)`
  height: 40px; /* Set the height of buttons */
`;

function Login(props) {
  const [id, setId] = useState();
  const [pw, setPw] = useState();
  const navigator = useNavigate();

  return (
    <Wrapper>
      <Container>
        <MainTitleText>로그인</MainTitleText>
        <TextInput
          height={20}
          value={id}
          onChange={(event) => {
            setId(event.target.value);
          }}
        />
        <TextInput
          height={20}
          value={pw}
          onChange={(event) => {
            setPw(event.target.value);
          }}
        />
        <ButtonsContainer>
          <Button
            title={"로그인"}
            onClick={() => {
              navigator("/MainPage");
            }}
          />
          <Button
            title={"회원가입"}
            onClick={() => {
              navigator("/Join");
            }}
          />
        </ButtonsContainer>
      </Container>
    </Wrapper>
  );
}

export default Login;
