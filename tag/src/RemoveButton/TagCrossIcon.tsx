import React from 'react';
import styled from 'styled-components';

const CrossIconSvg = `<svg width="16" height="16" viewBox="0 0 16 16" focusable="false" role="presentation">
<path d="M8,6.58578644 L9.29289322,5.29289322 C9.68341751,4.90236893 10.3165825,4.90236893 10.7071068,5.29289322 C11.0976311,5.68341751 11.0976311,6.31658249 10.7071068,6.70710678 L9.41421356,8 L10.7071068,9.29289322 C11.0976311,9.68341751 11.0976311,10.3165825 10.7071068,10.7071068 C10.3165825,11.0976311 9.68341751,11.0976311 9.29289322,10.7071068 L8,9.41421356 L6.70710678,10.7071068 C6.31658249,11.0976311 5.68341751,11.0976311 5.29289322,10.7071068 C4.90236893,10.3165825 4.90236893,9.68341751 5.29289322,9.29289322 L6.58578644,8 L5.29289322,6.70710678 C4.90236893,6.31658249 4.90236893,5.68341751 5.29289322,5.29289322 C5.68341751,4.90236893 6.31658249,4.90236893 6.70710678,5.29289322 L8,6.58578644 Z" fill="currentColor"></path>
</svg>`;

const IconWrapper = styled.span`
  height: 16px;
  width: 16px;
  display: inline-block;
  flex-shrink: 0;
  line-height: 1;

  > svg {
    height: 16px;
    width: 16px;
    max-height: 100%;
    max-width: 100%;
    overflow: hidden;
    pointer-events: none;
    vertical-align: bottom;
  }
`;

export default () => {
  return (
    <IconWrapper
      dangerouslySetInnerHTML={{
        __html: CrossIconSvg,
      }}
    />
  );
};
