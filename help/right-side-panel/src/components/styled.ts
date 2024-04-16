/** @jsx jsx */
import styled from '@emotion/styled';

export const FlexContainer = styled.div({
  display: 'flex',
});

export const ContentWrapper = styled.div({
  position: 'relative',
  minWidth: 0,
  flex: '1 1 auto',
  overflowX: 'hidden',
});
