/** @jsx jsx */
import { forwardRef, memo, Ref } from 'react';

import { jsx } from '@emotion/react';

import { propDeprecationWarning } from '@atlaskit/ds-lib/deprecation-warning';
import noop from '@atlaskit/ds-lib/noop';

import MenuItemPrimitive from '../internal/components/menu-item-primitive';
import type { ButtonItemProps } from '../types';

/**
 * __Button item__
 *
 * A button item is used to populate a menu with items that are buttons.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/button-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const ButtonItem = memo(
  forwardRef<HTMLElement, ButtonItemProps>(
    // Type needed on props to extract types with extract react types.
    (props: ButtonItemProps, ref) => {
      const {
        children,
        cssFn = noop as any,
        description,
        iconAfter,
        iconBefore,
        isDisabled = false,
        isSelected = false,
        onClick,
        testId,
        overrides,
        onMouseDown,
        shouldTitleWrap,
        shouldDescriptionWrap,
        ...rest
      } = props;
      const onMouseDownHandler = onMouseDown;

      if (!children) {
        return null;
      }

      propDeprecationWarning(
        process.env._PACKAGE_NAME_,
        'cssFn',
        cssFn !== noop,
        '', // TODO: Create DAC post when primitives/xcss are available as alternatives
      );

      return (
        <MenuItemPrimitive
          {...rest}
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
          overrides={overrides}
          iconBefore={iconBefore}
          iconAfter={iconAfter}
          isDisabled={isDisabled}
          isSelected={isSelected}
          description={description}
          title={children}
          shouldTitleWrap={shouldTitleWrap}
          shouldDescriptionWrap={shouldDescriptionWrap}
          css={
            // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
            cssFn({
              isSelected,
              isDisabled,
            })
          }
        >
          {({ children, className }) => (
            <button
              data-testid={testId}
              {...rest}
              className={className}
              ref={ref as Ref<HTMLButtonElement>}
              disabled={isDisabled}
              onClick={onClick}
              onMouseDown={onMouseDownHandler}
              type="button"
            >
              {children}
            </button>
          )}
        </MenuItemPrimitive>
      );
    },
  ),
);

export default ButtonItem;
