import styled from 'styled-components';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const ResultItemGroupHeader = styled.div`
  display: flex;
  margin-left: calc(-1 * ${token('space.150', '12px')});
  margin-top: ${token('space.150', '12px')};
`;

export const ResultItemGroupTitle = styled.div`
  font-size: 11px;
  line-height: ${token('font.lineHeight.100', '16px')};
  font-weight: 600;
`;

export const ResultItemAfter = styled.div<{ shouldTakeSpace: boolean }>`
  min-width: ${({ shouldTakeSpace }) => (shouldTakeSpace ? '24px' : 0)};
`;

export const ResultItemAfterWrapper = styled.div`
  display: flex;
`;

export const ResultItemCaption = styled.span`
  color: ${N200};
  font-size: 12px;
  margin-left: ${token('space.100', '8px')};
`;

export const ResultItemSubText = styled.span`
  font-size: 12px;
  color: ${N200};
`;

export const ResultItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: padding 200ms;

  > * {
    flex: 1 0 auto;
  }

  /* We need to ensure that any image passed in as a child (<img/>, <svg/>
    etc.) receives the correct width, height and border radius. We don't
    currently assume that the image passed in is the correct dimensions, or has
    width / height 100% */
  > img {
    height: ${token('space.300', '24px')};
    width: ${token('space.300', '24px')};
  }
`;

export const ResultItemTextAfter = styled.div`
  position: relative;
  z-index: 1;
`;
