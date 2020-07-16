import React from 'react';

import { CardAction } from '../../../actions';
import {
  CardActionIconButtonVariant,
  CardActionsView,
} from '../../../utils/cardActions';

import { Wrapper } from './styled';

export interface ActionsBarProps {
  actions: Array<CardAction>;
  isFixed?: boolean;
}

export class ActionsBar extends React.Component<ActionsBarProps> {
  render() {
    const { isFixed, actions } = this.props;

    if (actions.length === 0) {
      return null;
    }

    return (
      <Wrapper isFixed={isFixed}>
        <CardActionsView
          actions={actions}
          variant={CardActionIconButtonVariant.filled}
        />
      </Wrapper>
    );
  }
}
