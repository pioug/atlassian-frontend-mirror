/** @jsx jsx */

import { jsx } from '@emotion/core';

import {
  hasAfterStyles,
  hasBeforeStyles,
  linkStyles,
  roundedBorderStyles,
  textStyles,
} from './styles';
import { SimpleTagProps } from './types';

interface ContentProps extends SimpleTagProps {
  isRemovable?: boolean;
  isLink: boolean;
  isRounded: boolean;
  linkHoverColor: string;
}

const Content = (props: ContentProps) => {
  const {
    elemBefore = null,
    isRemovable = true,
    text = '',
    color = 'standard',
    href,
    isRounded,
    isLink,
    linkComponent: Link = 'a',
    linkHoverColor,
  } = props;

  if (isLink) {
    return (
      <Link
        href={href}
        data-color={color}
        css={[
          linkStyles(linkHoverColor),
          isRounded ? roundedBorderStyles : undefined,
          elemBefore ? hasBeforeStyles : undefined,
          isRemovable ? hasAfterStyles : undefined,
        ]}
      >
        {text}
      </Link>
    );
  } else {
    return (
      <span
        css={[
          textStyles,
          isRounded ? roundedBorderStyles : undefined,
          elemBefore ? hasBeforeStyles : undefined,
          isRemovable ? hasAfterStyles : undefined,
        ]}
      >
        {text}
      </span>
    );
  }
};

export default Content;
