import React from 'react';
import { ResultBase, ResultBaseProps } from '@atlaskit/quick-search';

import Return from '../assets/Return';

export interface Props extends ResultBaseProps {
  showKeyboardLozenge?: boolean;
}

export default class AdvancedSearchResult extends React.Component<Props> {
  static defaultProps = {
    showKeyboardLozenge: false,
  };

  getElemAfter() {
    const { showKeyboardLozenge } = this.props;
    if (!showKeyboardLozenge) {
      return null;
    }

    // Supposed to render ReturnHighlighted when the result isSelected, but that doesn't work anymore. See QS-281.
    return <Return />;
  }

  render() {
    const { showKeyboardLozenge, ...baseProps } = this.props;
    return (
      <ResultBase
        {...baseProps}
        elemAfter={this.getElemAfter()}
        onClick={this.props.onClick}
      />
    );
  }
}
