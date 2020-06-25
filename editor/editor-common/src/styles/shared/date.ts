import { css } from 'styled-components';

export const DateSharedCssClassName = {
  DATE_WRAPPER: `date-lozenger-container`,
  DATE_CONTAINER: 'dateView-content-wrap',
};

export const dateSharedStyle = css`
  .${DateSharedCssClassName.DATE_WRAPPER} {
    display: inline-block;
  }
`;
