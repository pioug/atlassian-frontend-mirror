import { token } from '@atlaskit/tokens';
import { N900 } from '@atlaskit/theme/colors';
import styled from '@emotion/styled';

export const InputWrapper = styled.div`
  margin: ${token('space.250', '20px')} 0;
`;

export const PreviewList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

export const PreviewInfo = styled.pre`
  font-size: 80%;
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const PreviewItem = styled.li`
  border-radius: 10px;
  border: 1px solid ${token('color.border', '#ccc')};
  padding: 10px;
  overflow: auto;
  max-height: 600px;
  position: relative;
  margin-bottom: 10px;
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const Code = styled.code`
  padding: 5px;
  border-radius: 5px;
  background-color: ${token('color.background.inverse.subtle', '#0002')};
  color: ${token('color.text', N900)};
  font-size: 80%;
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const PreviewImageContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const OrientationSelectWrapper = styled.label`
  margin-bottom: ${token('space.250', '20px')};
  display: block;
`;

export const TimeRangeWrapper = styled.div`
  margin-top: ${token('space.500', '40px')};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const Group = styled.div`
  width: 250px;
  padding: ${token('space.250', '20px')};
`;
