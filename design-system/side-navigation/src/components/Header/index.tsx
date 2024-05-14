/** @jsx jsx */
import { forwardRef } from 'react';

import { css, jsx } from '@emotion/react';

import { CSSFn, CustomItemComponentProps } from '@atlaskit/menu';
import { N500 } from '@atlaskit/theme/colors';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { overrideStyleFunction } from '../../common/styles';
import { CustomItem } from '../Item';

const containerStyles = css({ display: 'block', position: 'relative' });

/**
 * __Container__
 *
 * A container for Header and Footer that safely handles props to the child component
 */
export const Container = ({
  children,
  'data-testid': testId,
  ...props
}: CustomItemComponentProps) => {
  // https://stackoverflow.com/a/39333479
  const safeProps = (({
    className,
    onClick,
    onMouseDown,
    onDragStart,
    draggable,
    ref,
    tabIndex,
    disabled,
  }) => ({
    className,
    onClick,
    onMouseDown,
    onDragStart,
    draggable,
    ref,
    tabIndex,
    disabled,
  }))(props);
  return (
    <div data-testid={testId} css={containerStyles} {...safeProps}>
      {children}
    </div>
  );
};

export type HeaderProps = {
  /**
   * A function that can be used to override the styles of the component.
   * It receives the current styles and state and expects a styles object.
   * @deprecated Please avoid using this prop as we intend to remove the prop completely in a future release. See DSP-2682 for more information.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  cssFn?: CSSFn;

  /**
   * Element to render before the item text.
   * Generally should be an [icon](https://atlassian.design/components/icon/icon-explorer) component.
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
   * __Will return `null` if no component is defined.__
   * __NOTE:__ Make sure the reference for this component does not change between renders else undefined behavior may happen.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  component?: React.ComponentType<CustomItemComponentProps>;
};

/**
 * __Header__
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const Header = forwardRef<HTMLElement, HeaderProps>(
  (props: HeaderProps, ref) => {
    const cssFn = overrideStyleFunction(
      () => ({
        userSelect: 'auto',
        ['[data-item-title]']: {
          fontSize: headingSizes.h400.size,
          letterSpacing: '-0.003em',
          fontWeight: 600,
          color: token('color.text', N500),
        },
        // Will look interactive if the `component` is anything other than a div.
        'div&:hover': {
          backgroundColor: token(
            'color.background.neutral.subtle',
            'transparent',
          ),
          cursor: 'default',
        },
        'div&:active': {
          backgroundColor: token(
            'color.background.neutral.subtle',
            'transparent',
          ),
          color: token('color.text', N500),
        },
      }),
      props.cssFn,
    );

    return (
      <CustomItem
        {...props}
        ref={ref}
        component={props.component || Container}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
        cssFn={cssFn}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
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
