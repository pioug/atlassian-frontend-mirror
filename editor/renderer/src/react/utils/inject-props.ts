import React, { ReactNode, ReactElement } from 'react';

/**
 * Helper function to recursively injects props to
 * all valid children react nodes.
 */
export function recursivelyInjectProps(
  children: ReactNode[],
  propsToInject: Object,
): ReactNode[] {
  return React.Children.toArray(children).map((child) => {
    // Cannot add a prop to an invalid element, so just return the child
    if (!React.isValidElement(child)) {
      return child;
    }
    // Recursive call if child has nested children
    if (child.props.children) {
      child = React.cloneElement(child, {
        children: recursivelyInjectProps(child.props.children, propsToInject),
      } as JSX.ElementChildrenAttribute);
    }
    // Add props to react child node
    return React.cloneElement(child as ReactElement, propsToInject);
  });
}
