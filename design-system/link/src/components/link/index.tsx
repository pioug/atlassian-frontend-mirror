/** @jsx jsx */
import { type AnchorHTMLAttributes, forwardRef, type Ref } from 'react';

import { css, jsx } from '@compiled/react';

import type { RouterLinkComponentProps } from '@atlaskit/app-provider';
import { Box, xcss } from '@atlaskit/primitives';
import UNSAFE_ANCHOR, { type AnchorProps } from '@atlaskit/primitives/anchor';

const defaultLinkStyles = xcss({
  color: 'color.link',
  ':active': {
    color: 'color.link.pressed',
  },
  ':visited': {
    color: 'color.link.visited',
  },
  ':visited:active': {
    color: 'color.link.visited.pressed',
  },
});

const underlineStyles = xcss({
  textDecoration: 'underline',

  ':hover': {
    textDecoration: 'none',
  },
});

const noUnderlineStyles = xcss({
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'underline',
  },
});

// Prevent the icon from wrapping onto a new line by itself
// Using this technique involving a zero-width space: https://snook.ca/archives/html_and_css/icon-wrap-after-text
const iconWrapperStyles = xcss({
  display: 'inline',
  whiteSpace: 'nowrap',
});

const iconStyles = css({
  // Make icons relatively sized to text. This is important as text size is inherited,
  // so icons need to scale proportionally.
  width: '1em',
  height: '1em',
  // The icon should be relatively spaced from the text, so space tokens aren't suitable.
  // eslint-disable-next-line @atlaskit/design-system/use-tokens-space
  marginInlineStart: '.3em',
});

export type LinkProps<RouterLinkConfig extends Record<string, any> = never> =
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'onClick' | 'style' | 'children' | 'className'
  > &
    Pick<
      AnchorProps<RouterLinkConfig>,
      'interactionName' | 'analyticsContext' | 'onClick' | 'testId'
    > &
    RouterLinkComponentProps<RouterLinkConfig> & {
      /**
       * Show an underline in the link's resting state. Defaults to `true`
       */
      isUnderlined?: boolean;
    };

const LinkWithoutRef = <RouterLinkConfig extends Record<string, any> = never>(
  {
    children,
    testId,
    isUnderlined = true,
    target,
    // @ts-expect-error
    className: preventedClassName,
    // @ts-expect-error
    style: preventedStyle,
    ...htmlAttributes
  }: LinkProps<RouterLinkConfig>,
  ref: Ref<HTMLAnchorElement>,
) => {
  return (
    <UNSAFE_ANCHOR
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...htmlAttributes}
      target={target}
      ref={ref}
      // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
      xcss={[
        defaultLinkStyles,
        isUnderlined ? underlineStyles : noUnderlineStyles,
      ]}
      testId={testId}
      componentName="Link"
    >
      {children}
      {target === '_blank' && (
        <Box
          as="span"
          xcss={iconWrapperStyles}
          testId={testId && `${testId}__icon`}
        >
          {/* Zero-width space to prevent the icon from wrapping onto new line */}
          &#65279;
          {/* Unfortunately Shortcut Icon had to be copied directly below to support visited styles.
          This is because icons have a default `color` and although it's set to inherit text color, due to strict security restrictions for visited links it did not allow the color to pass through to the SVG */}
          <svg
            css={iconStyles}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.5715 3.95926L10.7587 10.772C10.5546 10.9692 10.2811 11.0784 9.99723 11.0759C9.71338 11.0734 9.44185 10.9596 9.24113 10.7589C9.04041 10.5581 8.92655 10.2866 8.92409 10.0027C8.92162 9.7189 9.03074 9.44543 9.22794 9.24125L16.0407 2.4285H14.3237C14.0366 2.4285 13.7613 2.31444 13.5582 2.11142C13.3552 1.90839 13.2411 1.63303 13.2411 1.34591C13.2411 1.05879 13.3552 0.783424 13.5582 0.580399C13.7613 0.377373 14.0366 0.263314 14.3237 0.263314H18.4981C18.5509 0.254962 18.6043 0.250507 18.658 0.250041C18.8017 0.248792 18.9443 0.276183 19.0773 0.330617C19.2104 0.385051 19.3313 0.465437 19.4329 0.567084C19.5346 0.668732 19.6149 0.789606 19.6694 0.922652C19.7238 1.0557 19.7512 1.19825 19.75 1.342C19.7495 1.3956 19.7451 1.44896 19.7367 1.50165V5.67628C19.7367 5.9634 19.6227 6.23877 19.4196 6.44179C19.2166 6.64482 18.9412 6.75888 18.6541 6.75888C18.367 6.75888 18.0916 6.64482 17.8886 6.44179C17.6856 6.23877 17.5715 5.9634 17.5715 5.67628V3.95926Z" />
            <path d="M2.41519 17.5848V2.4285H8.91076V0.263314H2.41194C1.22001 0.263314 0.25 1.23007 0.25 2.42201V17.5913C0.250574 18.1638 0.47834 18.7127 0.883283 19.1175C1.28823 19.5222 1.83724 19.7497 2.40978 19.75H17.5769C17.8608 19.7499 18.1418 19.6938 18.404 19.585C18.6662 19.4762 18.9044 19.3168 19.105 19.116C19.3055 18.9151 19.4646 18.6767 19.573 18.4143C19.6814 18.152 19.737 17.8708 19.7367 17.587V11.0893H17.5715V17.5848H2.41519Z" />
          </svg>
        </Box>
      )}
    </UNSAFE_ANCHOR>
  );
};

// Workarounds to support generic types with forwardRef
/**
 * __Link__
 *
 * A link is an inline text element that navigates to a new location when clicked.
 *
 * - [Examples](https://atlassian.design/components/primitives/link/examples)
 * - [Code](https://atlassian.design/components/primitives/link/code)
 * - [Usage](https://atlassian.design/components/primitives/link/usage)
 */
const Link = forwardRef(LinkWithoutRef) as <
  RouterLinkConfig extends Record<string, any> = never,
>(
  props: LinkProps<RouterLinkConfig> & {
    ref?: Ref<HTMLAnchorElement>;
  },
) => ReturnType<typeof LinkWithoutRef>;

export default Link;
