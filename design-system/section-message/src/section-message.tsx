/** @jsx jsx */
import React, { forwardRef, useMemo } from 'react';

import { jsx } from '@emotion/core';

import GlobalTheme, { GlobalThemeTokens } from '@atlaskit/theme/components';
import type { ThemeModes } from '@atlaskit/theme/types';

import {
  actionsStyle,
  containerStyle,
  contentContainerStyle,
  iconWrapperStyle,
  titleStyle,
} from './internal/styles';
import { appearanceIconTheming } from './internal/styles/theme';
import type { Appearance, SectionMessageProps } from './types';

function getAppearanceIconTheme(
  appearance: Appearance,
  icon: SectionMessageProps['icon'],
) {
  const appearanceIconTheme =
    appearanceIconTheming[appearance] || appearanceIconTheming.information;
  const Icon = icon || appearanceIconTheme.Icon;

  return {
    ...appearanceIconTheme,
    Icon,
  };
}

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
  const { backgroundColor, primaryIconColor, Icon } = getAppearanceIconTheme(
    appearance,
    icon,
  );

  const containerStyleWithBackground = useMemo(
    () => containerStyle(backgroundColor),
    [backgroundColor],
  );

  const memoizedTitleStyle = useMemo(() => titleStyle(mode), [mode]);
  const actionsArray = React.Children.toArray(actions);

  return (
    <section css={containerStyleWithBackground} data-testid={testId} ref={ref}>
      <div css={iconWrapperStyle}>
        <Icon
          primaryColor={primaryIconColor}
          secondaryColor={backgroundColor}
        />
      </div>
      <div css={contentContainerStyle}>
        {title ? <h1 css={memoizedTitleStyle}>{title}</h1> : null}
        <div>{children}</div>
        {actionsArray.length > 0 ? (
          <ul css={actionsStyle}>{actionsArray}</ul>
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
