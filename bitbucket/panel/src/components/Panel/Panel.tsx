import React, { PureComponent } from 'react';

import PanelStateless, { BasePanelProps } from './PanelStateless';

type Props = BasePanelProps & {
  /** Defines whether the panel is expanded by default. */
  isDefaultExpanded?: boolean;
};

type State = {
  isExpanded: boolean;
};

export default class Panel extends PureComponent<Props, State> {
  static defaultProps = {
    isDefaultExpanded: false,
  };

  state = {
    isExpanded: !!this.props.isDefaultExpanded,
  };

  handleChange = () => {
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  render() {
    const { children, header } = this.props;
    const { isExpanded } = this.state;

    return (
      <PanelStateless
        header={header}
        isExpanded={isExpanded}
        onChange={this.handleChange}
      >
        {children}
      </PanelStateless>
    );
  }
}
