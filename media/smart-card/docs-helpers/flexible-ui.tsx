/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Prop, Props } from '@atlaskit/docs';

const actionsStyles = css`
  > div,
  > div > div {
    margin-top: 0;
  }
  h3 {
    display: none;
  }
`;

const actionsProps = (
  <Props
    heading=""
    props={require('!!extract-react-types-loader!../docs-helpers/flexible-ui-actions-prop')}
  />
);

export const overrideActionsProps = (props: Object) => (
  <Prop
    {...props}
    shapeComponent={() => <div css={actionsStyles}>{actionsProps}</div>}
    type="arrayType"
  />
);
