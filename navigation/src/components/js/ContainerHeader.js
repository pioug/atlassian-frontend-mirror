import React, { PureComponent } from 'react';
import ContainerHeaderWrapper from '../styled/ContainerHeaderWrapper';
import { globalItemSizes } from '../../shared-variables';

export default class ContainerHeader extends PureComponent {
  static defaultProps = {
    iconOffset: globalItemSizes.medium,
    isInDrawer: false,
  };

  render() {
    // eslint-disable-next-line react/prop-types
    const { iconOffset, isFullWidth, isInDrawer } = this.props;
    return (
      <ContainerHeaderWrapper
        isInDrawer={isInDrawer}
        iconOffset={iconOffset}
        isFullWidth={isFullWidth}
      >
        {this.props.children}
      </ContainerHeaderWrapper>
    );
  }
}
