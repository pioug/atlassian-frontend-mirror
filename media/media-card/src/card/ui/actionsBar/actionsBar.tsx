import React from 'react';

import { CardActionIconButtonVariant, CardActionsView } from './cardActions';
import { ActionsBarWrapper } from './actionsBarWrapper';
import { ActionsBarProps } from './types';

export class ActionsBar extends React.Component<ActionsBarProps> {
  render() {
    const { isFixed, filename, actions } = this.props;

    if (actions.length === 0) {
      return null;
    }

    return (
      <ActionsBarWrapper isFixed={isFixed}>
        <CardActionsView
          filename={filename}
          actions={actions}
          variant={CardActionIconButtonVariant.filled}
        />
      </ActionsBarWrapper>
    );
  }
}
