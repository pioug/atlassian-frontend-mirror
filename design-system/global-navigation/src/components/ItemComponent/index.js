import React, { Component, createRef } from 'react';
import { DropdownMenuStateless } from '@atlaskit/dropdown-menu';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { GlobalItem } from '@atlaskit/navigation-next';

class DropdownItem extends Component {
  state = {
    isOpen: false,
  };

  handleOpenChange = ({ isOpen }) => this.setState({ isOpen });

  render() {
    const { items, trigger: Trigger } = this.props;
    const { isOpen } = this.state;

    return (
      <DropdownMenuStateless
        appearance="tall"
        boundariesElement="window"
        isOpen={isOpen}
        onOpenChange={this.handleOpenChange}
        position="right bottom"
        trigger={<Trigger isOpen={isOpen} />}
      >
        {items}
      </DropdownMenuStateless>
    );
  }
}

const ItemComponent = props => {
  const {
    dropdownItems: DropdownItems,
    itemComponent: CustomItemComponent,
    badgeCount,
    ...itemProps
  } = props;
  if (CustomItemComponent) {
    return <CustomItemComponent {...itemProps} />;
  }
  if (DropdownItems) {
    return (
      <DropdownItem
        trigger={({ isOpen }) => (
          <GlobalItem isSelected={isOpen} {...itemProps} />
        )}
        items={<DropdownItems />}
      />
    );
  }

  if (badgeCount !== undefined) {
    return (
      <NavigationAnalyticsContext
        data={{
          attributes: {
            badgeCount,
          },
        }}
      >
        <GlobalItem {...itemProps} />
      </NavigationAnalyticsContext>
    );
  }

  return <GlobalItem {...itemProps} />;
};

// eslint-disable-next-line react/no-multi-comp
export default class ItemComponentWithRef extends Component {
  // TODO: Try to refractor this component to a React Functional Component
  // using React.forwardRef
  node = createRef();

  componentDidMount() {
    this.publishRef();
  }

  componentDidUpdate() {
    this.publishRef();
  }

  publishRef() {
    const { getRef } = this.props;
    if (typeof getRef === 'function') {
      getRef(this.node);
    }
  }

  render() {
    const { ref, ...itemProps } = this.props;
    return (
      <span ref={this.node}>
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <ItemComponent {...itemProps} />
      </span>
    );
  }
}
