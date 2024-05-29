/**@jsx jsx */
import { jsx } from '@emotion/react';

import { wrapperStyles, actionsBarClassName } from './styles';
import { type ActionBarWrapperProps } from './types';

export const ActionsBarWrapper = (props: ActionBarWrapperProps) => {
  return (
    <div
      id="actionsBarWrapper"
      css={wrapperStyles(props.isFixed)}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
      className={actionsBarClassName}
    >
      {props.children}
    </div>
  );
};
