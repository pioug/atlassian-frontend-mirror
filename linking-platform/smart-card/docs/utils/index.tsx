/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Prop, Props } from '@atlaskit/docs';

export const TabName = {
  Examples: 'Examples',
  Reference: 'Reference',
};

export const toAbsolutePath = (path?: string) => {
  if (path?.startsWith('./')) {
    const current = window.location.href;
    const parent = current.slice(0, current.lastIndexOf('/'));
    return path.replace(path[0], parent);
  }
  return path;
};

export const overrideActionsProps = (props: Object) => (
  <Prop
    {...props}
    shapeComponent={() => (
      <div
        css={css({
          '> div, > div > div': {
            marginTop: 0,
          },
          h3: {
            display: 'none',
          },
        })}
      >
        <Props
          heading=""
          props={require('!!extract-react-types-loader!./props-actions')}
        />
      </div>
    )}
    type="arrayType"
  />
);
