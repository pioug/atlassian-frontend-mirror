import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

export const Quiz = styled.div({
  display: 'flex',
  flexDirection: 'column',
  fontSize: '16px',
  width: '100%',
  padding: `${token('space.250', '20px')} 30px ${token('space.250', '20px')} 0`,
  border: '1px solid grey',
  borderRadius: '28px',
  minWidth: '300px',
  maxWidth: '380px',
});

export const QuizName = styled.div({
  margin: '3px 0',
  fontSize: '24px',
  fontWeight: 500,
  paddingLeft: token('space.250', '20px'),
});

export const Header = styled.div({
  display: 'flex',
  alignItems: 'start',
  flexDirection: 'column',
});

export const QuizBlock = styled.ul({
  // eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- needs manual remediation
  paddingLeft: '15px',
  // eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- needs manual remediation
  marginBottom: '15px',
  marginTop: 0,
  minHeight: '105px',
});

export const Footer = styled.div({
  paddingLeft: token('space.100', '8px'),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxHeight: '32px',
});

export const Question = styled.div({
  paddingLeft: token('space.075', '6px'),
  // eslint-disable-next-line @atlaskit/design-system/use-tokens-space  -- needs manual remediation
  marginBottom: '10px',
  fontSize: '14px',
  color: '#707070',
  textAlign: 'left',
});

export const NavQuiz = styled.div({
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  padding: '0 0 0 3px',
  ':hover': {
    color: 'grey',
  },
});

export const NavAction = styled.span({
  fontSize: '14px',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
});

export const Score = styled.div({
  // eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- needs manual remediation
  marginTop: '10px',
  paddingLeft: token('space.075', '6px'),
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'start',
  fontWeight: 400,
  // eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- needs manual remediation
  gap: '5px',
});

export const Answer = styled.div({
  display: 'flex',
  alignItems: 'flex-end',
  maxHeight: '25px',
});
