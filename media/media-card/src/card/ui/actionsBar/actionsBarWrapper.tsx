/**@jsx jsx */
import { jsx } from '@emotion/react';

import { wrapperStyles, actionsBarClassName } from './styles';
import { type ActionBarWrapperProps } from './types';

export const ActionsBarWrapper = (props: ActionBarWrapperProps) => {
  return (
    <div
      id="actionsBarWrapper"
      css={wrapperStyles(props.isFixed)}
      className={actionsBarClassName}
    >
      {props.children}
    </div>
  );
};
