import React, { Component, ComponentType, ReactNode } from 'react';

import PropTypes from 'prop-types';

import { IconProps } from '@atlaskit/icon';
import { B400, N40 } from '@atlaskit/theme/colors';

import { Behaviors } from '../../types';
import { selectionManagerContext } from '../../util/contextNamespace';
import getDisplayName from '../../util/getDisplayName';
import { KEY_ENTER, KEY_SPACE } from '../../util/keys';
import safeContextCall from '../../util/safeContextCall';

export interface Props {
  /** Content to be displayed inside the item. Same as `@atlaskit/item` `children` prop. */
  children?: ReactNode;
  /** Unique identifier for the item, so that selection state can be tracked when the dropdown
   * is opened/closed. */
  id: string;
  /** Set at mount to make the item appear checked. The user may interact with the
   * item after mount. See `isSelected` if you want to control the item state manually. */
  defaultSelected?: boolean;
  /** Causes the item to appear visually checked. Can be set at mount time, and updated after
   * mount. Changing the value will not cause `onClick` to be called. */
  isSelected?: boolean;
  /** Standard optional `onClick` handler */
  onClick?: React.MouseEventHandler<HTMLElement>;
}

// HOC that typically wraps @atlaskit/item
const withToggleInteraction = (
  WrappedComponent: ComponentType,
  SelectionIcon: ComponentType<IconProps>,
  getAriaRole: () => Behaviors,
) =>
  class WithToggleInteraction extends Component<Props> {
    static displayName = `WithToggleInteraction(${getDisplayName(
      WrappedComponent,
    )})`;

    static defaultProps = {
      onClick: () => {},
    };

    static contextTypes = {
      [selectionManagerContext]: PropTypes.object.isRequired,
    };

    componentDidMount() {
      const { defaultSelected, isSelected, id } = this.props;
      this.warnIfUseControlledAndUncontrolledState();

      this.callContextFn('setItemSelected', id, isSelected, defaultSelected);
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
      const { id, defaultSelected, isSelected } = nextProps;
      if (this.props.isSelected !== isSelected) {
        this.callContextFn('setItemSelected', id, isSelected, defaultSelected);
      }
    }

    getIconColors = (isSelected: boolean = false) => {
      if (isSelected) {
        return { primary: B400, secondary: N40 };
      }
      return { primary: N40, secondary: N40 };
    };

    warnIfUseControlledAndUncontrolledState = () => {
      if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
        if (this.props.defaultSelected && this.props.isSelected) {
          // eslint-disable-next-line no-console
          console.warn(
            'DropdownItem defaultSelected and isSelected props should not be used at the same time.',
          );
        }
      }
    };

    callContextFn = safeContextCall(this, selectionManagerContext);

    handleKeyboard = (event: React.KeyboardEvent<HTMLElement>) => {
      const { key } = event;
      if (key === KEY_ENTER || key === KEY_SPACE) {
        // We prevent default here to avoid page scroll
        event.preventDefault();

        this.handleItemActivated(event);
      }
    };

    handleItemActivated = (
      event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>,
    ) => {
      if (this.props.onClick) {
        this.props.onClick(event as React.MouseEvent<HTMLElement>);
      }
      this.callContextFn('itemClicked', this.props.id);
    };

    isSelectedInDropdown = () =>
      this.callContextFn('isItemSelected', this.props.id);

    render() {
      const { children, ...otherProps } = this.props;
      const isSelected = this.isSelectedInDropdown();
      const iconColors = this.getIconColors(!!isSelected);
      const ariaRole = getAriaRole();

      const wrappedCompProps = {
        ...otherProps,
        role: ariaRole,
        'aria-checked': isSelected,
        isSelected: isSelected,
        onClick: this.handleItemActivated,
        onKeyDown: this.handleKeyboard,
        elemBefore: (
          <SelectionIcon
            primaryColor={iconColors.primary}
            secondaryColor={iconColors.secondary}
            size="medium"
            label=""
          />
        ),
      };
      return (
        <WrappedComponent {...wrappedCompProps}>{children}</WrappedComponent>
      );
    }
  };

export default withToggleInteraction;
