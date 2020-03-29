import React, { Component, ReactNode, ComponentType } from 'react';
// import getDisplayName from '../../util/getDisplayName';
import DropdownItemSelectionManager from '../context/DropdownItemSelectionManager';
import { Behaviors } from '../../types';

export interface WithDropdownItemSelectionManagerProps {
  children?: ReactNode;
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
    // static displayName = `WithDropdownItemSelectionManager(${getDisplayName(
    //   WrappedComponent,
    // )})`;

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
