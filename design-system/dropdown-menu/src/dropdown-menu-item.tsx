import React from 'react';

import ButtonItem from '@atlaskit/menu/button-item';
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
const DropdownMenuItem = (props: DropdownItemProps) => {
  const {
    elemBefore,
    elemAfter,
    href,
    shouldTitleWrap = true,
    shouldDescriptionWrap = true,
    ...rest
  } = props;

  const itemRef = useRegisterItemWithFocusManager();

  if (href) {
    return (
      <LinkItem
        href={href}
        iconBefore={elemBefore}
        iconAfter={elemAfter}
        role="menuitem"
        ref={itemRef}
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
        ref={itemRef}
        shouldTitleWrap={shouldTitleWrap}
        shouldDescriptionWrap={shouldDescriptionWrap}
        {...rest}
      />
    );
  }
};

export default DropdownMenuItem;
