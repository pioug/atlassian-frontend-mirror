import React, { forwardRef } from 'react';

import { CSSFn, CustomItemComponentProps } from '@atlaskit/menu';
import { N500 } from '@atlaskit/theme/colors';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { overrideStyleFunction } from '../../common/styles';
import { CustomItem } from '../Item';

const Container: React.FC<CustomItemComponentProps> = (props) => {
  return <div {...props} />;
};

export interface HeaderProps {
  /**
   * A function that can be used to override the styles of the component.
   * It receives the current styles and state and expects a styles object.
   */
  cssFn?: CSSFn;

  /**
   * Element to render before the item text.
   * Generally should be an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.
   */
  iconBefore?: React.ReactNode;

  /**
   * Event that is triggered when the element is clicked.
   */
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;

  /**
   * Description of the item.
   * This will render smaller text below the primary text of the item as well as slightly increasing the height of the item.
   */
  description?: string | JSX.Element;

  /**
   * Primary content for the item.
   */
  children?: React.ReactNode;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;

  /**
   * Custom component to render as an item.
   * This can be both a functional component or a class component.
   * **Will return `null` if no component is defined.**

   * **NOTE:** Make sure the reference for this component does not change between renders else undefined behavior may happen.
   */
  component?: React.ComponentType<CustomItemComponentProps>;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  (props: HeaderProps, ref) => {
    const cssFn = overrideStyleFunction(
      () => ({
        userSelect: 'auto',
        ['[data-item-title]']: {
          fontSize: headingSizes.h400.size,
          letterSpacing: '-0.003em',
          fontWeight: 600,
          color: token('color.text.highEmphasis', N500),
        },
        // Will look interactive if the `component` is anything other than a div.
        'div&:hover': {
          backgroundColor: 'transparent',
          cursor: 'default',
        },
        'div&:active': {
          backgroundColor: 'transparent',
          color: token('color.text.highEmphasis', N500),
        },
      }),
      props.cssFn,
    );

    return (
      <CustomItem
        {...props}
        ref={ref}
        component={props.component || Container}
        cssFn={cssFn}
        overrides={{
          Title: {
            render: (_, { children, ...props }) => (
              <h2 {...props}>{children}</h2>
            ),
          },
        }}
      />
    );
  },
);

export default Header;
