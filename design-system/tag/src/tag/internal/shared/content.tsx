/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import { useGlobalTheme } from '@atlaskit/theme/components';

import {
  buttonWidthUnitless,
  defaultTextPadding,
  maxTextWidth,
  maxTextWidthUnitless,
  textFontSize,
  textMarginLeft,
  textPaddingRight,
} from '../../../constants';
import * as theme from '../../../theme';

import type { SimpleTagProps } from './types';

interface ContentProps extends SimpleTagProps {
  isRemovable?: boolean;
}

const baseStyles = css({
  maxWidth: maxTextWidth,
  paddingTop: '2px',
  paddingRight: defaultTextPadding,
  paddingBottom: '2px',
  paddingLeft: defaultTextPadding,
  fontSize: textFontSize,
  fontWeight: 'normal',
  lineHeight: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const linkStyles = css({
  pointerEvents: 'auto',
  textDecoration: 'none',
  '&:focus': {
    outline: 'none',
  },
});

const lightLinkStyles = css({
  '&:hover': {
    color: theme.linkHoverTextColors.light,
  },
});

const darkLinkStyles = css({
  '&:hover': {
    color: theme.linkHoverTextColors.dark,
  },
});

const colorfulLinkStyles = css({
  color: 'inherit',
  textDecoration: 'underline',
});

const hasAfterStyles = css({
  maxWidth: `${maxTextWidthUnitless - buttonWidthUnitless}px`,
  paddingRight: textPaddingRight,
});

const hasBeforeStyles = css({
  marginLeft: textMarginLeft,
});

const Content = ({
  elemBefore = null,
  isRemovable = true,
  text = '',
  color = 'standard',
  href,
  linkComponent,
}: ContentProps) => {
  const { mode } = useGlobalTheme();

  const Link = linkComponent ?? 'a';

  if (href) {
    return (
      <Link
        href={href}
        data-color={color}
        css={[
          baseStyles,
          linkStyles,
          mode === 'light' && lightLinkStyles,
          mode === 'dark' && darkLinkStyles,
          color !== 'standard' && colorfulLinkStyles,
          elemBefore && hasBeforeStyles,
          isRemovable && hasAfterStyles,
        ]}
      >
        {text}
      </Link>
    );
  } else {
    return (
      <span
        css={[
          baseStyles,
          elemBefore && hasBeforeStyles,
          isRemovable && hasAfterStyles,
        ]}
      >
        {text}
      </span>
    );
  }
};

export default Content;
