import { token } from '@atlaskit/tokens';
import { N900 } from '@atlaskit/theme/colors';
import styled from '@emotion/styled';

export const InputWrapper = styled.div({
  margin: `${token('space.250', '20px')} 0`,
});

export const PreviewList = styled.ul({
  margin: 0,
  padding: 0,
  listStyleType: 'none',
});

export const PreviewInfo = styled.pre({
  fontSize: '80%',
});

export const PreviewItem = styled.li({
  borderRadius: token('space.100', '8px'),
  border: `1px solid ${token('color.border', '#ccc')}`,
  padding: token('space.100', '8px'),
  overflow: 'auto',
  maxHeight: '600px',
  position: 'relative',
  marginBottom: token('space.100', '8px'),
});

export const Code = styled.code({
  padding: token('space.050', '4px'),
  borderRadius: token('space.050', '4px'),
  backgroundColor: token('color.background.inverse.subtle', '#0002'),
  color: token('color.text', N900),
  fontSize: '80%',
});

export const CloseButton = styled.button({
  position: 'absolute',
  top: token('space.050', '4px'),
  right: token('space.050', '4px'),
  cursor: 'pointer',
});

export const PreviewImageContainer = styled.div({
  marginTop: token('space.100', '8px'),
  marginBottom: token('space.100', '8px'),
});

export const OrientationSelectWrapper = styled.label({
  marginBottom: token('space.250', '20px'),
  display: 'block',
});

export const TimeRangeWrapper = styled.div({
  marginTop: token('space.500', '40px'),
});

export const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
});

export const Group = styled.div({
  width: '250px',
  padding: token('space.250', '20px'),
});
