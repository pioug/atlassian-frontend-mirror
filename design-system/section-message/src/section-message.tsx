/** @jsx jsx */
import React, { forwardRef, useMemo } from 'react';

import { css, jsx } from '@emotion/core';

import { DN600, N800 } from '@atlaskit/theme/colors';
import GlobalTheme, { GlobalThemeTokens } from '@atlaskit/theme/components';
import { borderRadius, fontSize, gridSize } from '@atlaskit/theme/constants';
import type { ThemeModes } from '@atlaskit/theme/types';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { getAppearanceIconStyles } from './internal/appearance-icon';
import type { SectionMessageProps } from './types';

const spacing = gridSize();

const titleMarginBottom = spacing;
const containerPadding = spacing * 2;
const actionMarginTop = spacing;
const iconWrapperWidth = spacing * 5;

const titleColor = {
  light: token('color.text.highEmphasis', N800),
  dark: token('color.text.highEmphasis', DN600),
};

const containerStyles = css({
  display: 'flex',
  padding: `${containerPadding}px`,
  borderRadius: `${borderRadius()}px`,
});

const contentContainerStyles = css({
  flexGrow: 1,
});

const titleStyles = css({
  margin: `0 0 ${titleMarginBottom}px`,
  fontSize: `${headingSizes.h500.size / fontSize()}em`,
  fontStyle: 'inherit',
  fontWeight: 600,
  letterSpacing: '-0.006em',
  lineHeight: `${headingSizes.h500.lineHeight / headingSizes.h500.size}`,
});

const actionsStyles = css({
  display: 'flex',
  marginTop: `${actionMarginTop}px`,
  paddingLeft: 0,
  listStyle: 'none',
});

// If the icon is not wrapped in a div with a width, and we instead use margin or
// padding, the icon is shrunk by the padding.
// Since the icons will have a consistent size, we can treat them as pre-calculated
// space.
const iconWrapperStyles = css({
  display: 'flex',
  width: `${iconWrapperWidth}px`,
  margin: '-2px 0',
  flex: '0 0 auto',
});

interface InternalProps extends SectionMessageProps {
  mode: ThemeModes;
}

const SectionMessageWithMode = forwardRef(function SectionMessage(
  {
    children,
    appearance = 'information',
    actions,
    title,
    icon,
    testId,
    mode,
  }: InternalProps,
  ref: React.Ref<HTMLElement>,
) {
  const { backgroundColor, primaryIconColor, Icon } = getAppearanceIconStyles(
    appearance,
    icon,
  );

  const containerStyleWithBackground = useMemo(
    () => ({ backgroundColor: backgroundColor }),
    [backgroundColor],
  );

  const memoizedTitleColor = useMemo(() => ({ color: titleColor[mode] }), [
    mode,
  ]);
  const actionsArray = React.Children.toArray(actions);

  return (
    <section
      css={containerStyles}
      style={containerStyleWithBackground}
      data-testid={testId}
      ref={ref}
    >
      <div css={iconWrapperStyles}>
        <Icon
          primaryColor={primaryIconColor}
          secondaryColor={backgroundColor}
        />
      </div>
      <div css={contentContainerStyles}>
        {title ? (
          <h1 css={titleStyles} style={memoizedTitleColor}>
            {title}
          </h1>
        ) : null}
        <div>{children}</div>
        {actionsArray.length > 0 ? (
          <ul css={actionsStyles}>{actionsArray}</ul>
        ) : null}
      </div>
    </section>
  );
});

const SectionMessage = forwardRef(function SectionMessage(
  props: SectionMessageProps,
  ref: React.Ref<HTMLElement>,
) {
  return (
    <GlobalTheme.Consumer>
      {({ mode }: GlobalThemeTokens) => (
        <SectionMessageWithMode {...props} mode={mode} ref={ref} />
      )}
    </GlobalTheme.Consumer>
  );
});

SectionMessage.displayName = 'SectionMessage';

export default SectionMessage;
