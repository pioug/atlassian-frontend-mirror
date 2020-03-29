/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';

export const maxPrimaryItems = 3;

function checkIfTooManyPrimaryActions(actions = []) {
  if (actions.length > maxPrimaryItems) {
    // eslint-disable-next-line no-console
    console.warn(
      `AkGlobalNavigation will only render up to ${maxPrimaryItems} primary actions.`,
    );
  }
}

export default class GlobalPrimaryActionsList extends PureComponent {
  constructor(props, context) {
    super(props, context);
    checkIfTooManyPrimaryActions(props.actions);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    checkIfTooManyPrimaryActions(nextProps.actions);
  }

  render() {
    return (
      <div>
        {this.props.actions.map((action, index) =>
          // eslint-disable-next-line react/no-array-index-key
          index < maxPrimaryItems ? <div key={index}>{action}</div> : null,
        )}
      </div>
    );
  }
}
