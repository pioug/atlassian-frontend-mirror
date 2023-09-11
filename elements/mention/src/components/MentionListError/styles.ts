import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import { borderRadius } from '@atlaskit/theme/constants';
import { N500 } from '@atlaskit/theme/colors';
import { h400 } from '@atlaskit/theme/typography';

export const MentionListErrorStyle = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: ${token('elevation.surface.overlay', 'white')};
  color: ${token('color.text.subtle', N500)};
  border: 1px solid ${token('elevation.surface.overlay', '#fff')};
  border-radius: ${borderRadius()}px;
`;

export const GenericErrorVisualStyle = styled.div`
  height: 108px;
  margin-bottom: ${token('space.100', '8px')};
  margin-top: 36px;
  width: 83px;
`;

// TODO: Figure out why the themed css function is causing type errors when passed prop children
export const MentionListErrorHeadlineStyle = styled.div`
  ${h400()};
  margin-bottom: ${token('space.100', '8px')};
`;

export const MentionListAdviceStyle = styled.div`
  margin-bottom: ${token('space.600', '48px')};
`;
