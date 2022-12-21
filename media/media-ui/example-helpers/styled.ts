import { token } from '@atlaskit/tokens';
import { N900 } from '@atlaskit/theme/colors';
import styled from '@emotion/styled';

export const InputWrapper = styled.div`
  margin: 20px 0;
`;

export const PreviewList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

export const PreviewInfo = styled.pre`
  font-size: 80%;
`;

export const PreviewItem = styled.li`
  border-radius: 10px;
  border: 1px solid ${token('color.border', '#ccc')};
  padding: 10px;
  overflow: auto;
  max-height: 600px;
  position: relative;
  margin-bottom: 10px;
`;

export const Code = styled.code`
  padding: 5px;
  border-radius: 5px;
  background-color: ${token('color.background.inverse.subtle', '#0002')};
  color: ${token('color.text', N900)};
  font-size: 80%;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
`;

export const PreviewImageContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const OrientationSelectWrapper = styled.label`
  margin-bottom: 20px;
  display: block;
`;

export const TimeRangeWrapper = styled.div`
  margin-top: 40px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
export const Group = styled.div`
  width: 250px;
  padding: 20px;
`;
