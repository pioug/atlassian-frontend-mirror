import styled from '@emotion/styled';

export const Quiz = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  width: 100%;
  padding: 20px 30px 20px 0;
  border: 1px solid grey;
  border-radius: 28px;
  min-width: 300px;
  max-width: 380px;
`;

export const QuizName = styled.div`
  margin: 3px 0;
  font-size: 24px;
  font-weight: 500;
  padding-left: 20px;
`;

export const Header = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
`;

export const QuizBlock = styled.ul`
  padding-left: 15px;
  margin-bottom: 15px;
  margin-top: 0;
  min-height: 105px;
`;

export const Footer = styled.div`
  padding-left: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: 32px;
`;

export const Question = styled.div`
  padding-left: 6px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #707070;
  text-align: left;
`;

export const NavQuiz = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 0 0 0 3px;
  :hover {
    color: grey;
  }
`;

export const NavAction = styled.span`
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

export const Score = styled.div`
  margin-top: 10px;
  padding-left: 6px;
  display: flex;
  flex-direction: column;
  text-align: start;
  font-weight: 400;
  gap: 5px;
`;

export const Answer = styled.div`
  display: flex;
  align-items: flex-end;
  max-height: 25px;
`;
