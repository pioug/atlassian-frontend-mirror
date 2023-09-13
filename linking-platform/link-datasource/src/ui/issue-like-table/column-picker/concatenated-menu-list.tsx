/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import {
  components,
  MenuListComponentProps,
  OptionType,
} from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { columnPickerMessages } from './messages';

export const SELECT_ITEMS_MAXIMUM_THRESHOLD = 200;

const messageStyles = css({
  color: token('color.text.subtle', '#44546F'),
  fontSize: token('font.size.050', '11px'),
  fontWeight: token('font.weight.regular', '400'),
  lineHeight: token('font.lineHeight.100', '14px'),
});

export const ConcatenatedMenuList = ({
  children,
  ...props
}: MenuListComponentProps<OptionType, true>) => {
  const shouldUseDefaultMenuList =
    !children ||
    !Array.isArray(children) ||
    children.length <= SELECT_ITEMS_MAXIMUM_THRESHOLD;

  if (shouldUseDefaultMenuList) {
    return <components.MenuList {...props}>{children}</components.MenuList>;
  }

  const optionStyle = {
    padding: `${token('space.050', '4px')} ${token('space.200', '16px')}`,
    height: 'auto',
  };
  const maximumLimitReachedMessage = (
    <div css={messageStyles} style={optionStyle}>
      <FormattedMessage
        tagName={'div'}
        {...columnPickerMessages.maximumItemsShownLine1}
      />
      <FormattedMessage
        tagName={'div'}
        {...columnPickerMessages.maximumItemsShownLine2}
      />
    </div>
  );

  return (
    <components.MenuList {...props}>
      {children.slice(0, SELECT_ITEMS_MAXIMUM_THRESHOLD)}
      {maximumLimitReachedMessage}
    </components.MenuList>
  );
};
