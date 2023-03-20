import React, { forwardRef } from 'react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import ButtonItem from '@atlaskit/menu/button-item';
import CustomItem from '@atlaskit/menu/custom-item';
import LinkItem from '@atlaskit/menu/link-item';

import useRegisterItemWithFocusManager from './internal/hooks/use-register-item-with-focus-manager';
import { DropdownItemProps } from './types';

/**
 * __Dropdown menu item__
 *
 * A dropdown item populates the dropdown menu with items. Every item should be inside a dropdown item group.
 *
 * - [Examples](https://atlassian.design/components/dropdown-item/examples)
 * - [Code](https://atlassian.design/components/dropdown-item/code)
 * - [Usage](https://atlassian.design/components/dropdown-item/usage)
 */
const DropdownMenuItem = forwardRef<HTMLElement, DropdownItemProps>(
  (props, ref) => {
    const {
      component,
      elemBefore,
      elemAfter,
      shouldTitleWrap = true,
      shouldDescriptionWrap = true,
      ...rest
    } = props;

    const itemRef = useRegisterItemWithFocusManager();
    if (component) {
      return (
        <CustomItem
          component={component}
          iconBefore={elemBefore}
          iconAfter={elemAfter}
          shouldTitleWrap={shouldTitleWrap}
          shouldDescriptionWrap={shouldDescriptionWrap}
          {...rest}
        />
      );
    } else if (props.href) {
      return (
        <LinkItem
          href={props.href}
          iconBefore={elemBefore}
          iconAfter={elemAfter}
          role="menuitem"
          ref={mergeRefs([ref, itemRef])}
          shouldTitleWrap={shouldTitleWrap}
          shouldDescriptionWrap={shouldDescriptionWrap}
          {...rest}
        />
      );
    } else {
      return (
        <ButtonItem
          role="menuitem"
          iconBefore={elemBefore}
          iconAfter={elemAfter}
          ref={mergeRefs([ref, itemRef])}
          shouldTitleWrap={shouldTitleWrap}
          shouldDescriptionWrap={shouldDescriptionWrap}
          {...rest}
        />
      );
    }
  },
);

export default DropdownMenuItem;
