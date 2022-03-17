/** @jsx jsx */
import { css, jsx } from '@emotion/react';

const beforePrimaryToolbarPluginWrapper = css`
  display: flex;
  margin-right: 8px;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
`;

export const BeforePrimaryToolbarWrapper = (props: {
  beforePrimaryToolbarComponents: any;
}) => (
  <div
    css={beforePrimaryToolbarPluginWrapper}
    data-testid={'before-primary-toolbar-components-plugin'}
  >
    {props.beforePrimaryToolbarComponents}
  </div>
);
