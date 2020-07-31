import React, { Component, ComponentType } from 'react';

import { Behaviors } from '../../types';
import DropdownItemSelectionManager from '../context/DropdownItemSelectionManager';

export interface WithDropdownItemSelectionManagerProps {
  /**
   * Unique `id` used to enable selections.
   * When using multiple groups make sure they each have a unique `id`.
   */
  id: string;
}

// HOC that typically wraps @atlaskit/item/ItemGroup
const withDropdownItemSelectionManager = <BaseProps extends {}>(
  WrappedComponent: ComponentType<BaseProps>,
  selectionBehavior: Behaviors,
) =>
  class WithDropdownItemSelectionManager extends Component<
    BaseProps & WithDropdownItemSelectionManagerProps
  > {
    render() {
      const { children, id, ...otherProps } = this.props;

      return (
        <WrappedComponent {...((otherProps as unknown) as BaseProps)}>
          <DropdownItemSelectionManager
            groupId={id}
            behavior={selectionBehavior}
          >
            {children}
          </DropdownItemSelectionManager>
        </WrappedComponent>
      );
    }
  };

export default withDropdownItemSelectionManager;
