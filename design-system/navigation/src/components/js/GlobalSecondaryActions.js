/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';

export const maxSecondaryItems = 5;

function checkIfTooManySecondaryActions(actions = []) {
  if (actions.length > maxSecondaryItems) {
    // eslint-disable-next-line no-console
    console.warn(
      `AkGlobalNavigation will only render up to ${maxSecondaryItems} secondary actions.`,
    );
  }
}

export default class GlobalSecondaryActions extends PureComponent {
  constructor(props, context) {
    super(props, context);
    checkIfTooManySecondaryActions(props.actions);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    checkIfTooManySecondaryActions(nextProps.actions);
  }

  render() {
    return (
      <div>
        {this.props.actions.map((action, index) =>
          // eslint-disable-next-line react/no-array-index-key
          index < maxSecondaryItems ? <div key={index}>{action}</div> : null,
        )}
      </div>
    );
  }
}
