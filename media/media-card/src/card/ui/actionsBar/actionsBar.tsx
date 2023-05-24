import React from 'react';

import { CardActionIconButtonVariant, CardActionsView } from './cardActions';
import { ActionsBarWrapper } from './actionsBarWrapper';
import { ActionsBarProps } from './types';

export class ActionsBar extends React.Component<ActionsBarProps> {
  render() {
    const { isFixed, actions } = this.props;

    if (actions.length === 0) {
      return null;
    }

    return (
      <ActionsBarWrapper isFixed={isFixed}>
        <CardActionsView
          actions={actions}
          variant={CardActionIconButtonVariant.filled}
        />
      </ActionsBarWrapper>
    );
  }
}
