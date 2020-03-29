import styled from 'styled-components';

const BackButtonIconWrapper = styled.span`
  display: inline-block;
  /* We want the icon (the only directly child) inside this wrapper to be vertically middle align. */
  & > * {
    vertical-align: middle;
  }
`;

BackButtonIconWrapper.displayName = 'BackButtonIconWrapper';
export default BackButtonIconWrapper;
