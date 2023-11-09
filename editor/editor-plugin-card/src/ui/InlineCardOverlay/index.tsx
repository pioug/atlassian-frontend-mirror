/** @jsx jsx */
import type { FC } from 'react';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { browser } from '@atlaskit/editor-common/utils';
import HipchatChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import HipchatChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import { N20A, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../../messages';

import type { InlineCardOverlayProps } from './types';

const PADDING_IN_PX = 2;

const containerStyles = css({
  position: 'relative',
});

const linkStyles = css({
  color: token('color.text', '#172B4D'),
  textDecoration: 'none',
});

const overlayStyles = css({
  // Positioning
  position: 'relative',
  display: 'inline-flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  alignSelf: 'stretch',
  height: 'inherit',
  lineHeight: 'initial',
  width: 'max-content',
  top: token('space.0', '0'),
  bottom: token('space.0', '0'),
  right: 3,
  margin: `-1px ${token('space.0', '0')}`,
  padding: token('space.0', '0'),

  // Styling
  fontSize: 'inherit',
  fontWeight: 'normal',
  color: token('color.text', N800),
  background: token('color.background.accent.gray.subtlest', N20A),
  borderRadius: 3, // inline card border of 4px - 1px

  // Using `&` twice to increase specificity. (These are not nested styles.)
  /* eslint-disable @atlaskit/design-system/no-nested-styles */
  '&&:link': { ...linkStyles },
  '&&:active': { ...linkStyles },
  '&&:focus': { ...linkStyles },
  '&&:hover': { ...linkStyles },
  '&&:visited': { ...linkStyles },
  /* eslint-enable @atlaskit/design-system/no-nested-styles */

  // EDM-1717: box-shadow Safari fix bring load wrapper zIndex to 1
  zIndex: 2,

  // Fill lines, match heading and paragraph size
  '::before': {
    content: '" "',
    display: 'inline-block',
    verticalAlign: 'middle',
    width: token('space.0', '0'),
    margin: token('space.0', '0'),
    padding: token('space.0', '0'),
  },
});

const safariOverlayStyles = css({
  height: '1.1em',
  paddingBottom: token('space.025', '2px'),
  right: 3,
});

const textStyles = css({
  paddingLeft: token('space.050', '4px'),
});

const iconStyles = css({
  // Position icon in the middle
  display: 'inline-grid',

  // We want to position the icon in the middle of large text type like heading 1
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  span: {
    display: 'inline-grid',
  },
});

const markerStyles = css({
  height: token('space.0', '0'),
  width: token('space.0', '0'),
  margin: token('space.0', '0'),
  padding: token('space.0', '0'),
});

const InlineCardOverlay: FC<InlineCardOverlayProps> = ({
  children,
  isToolbarOpen = false,
  isVisible = false,
  testId = 'inline-card-overlay',
  url,
}) => {
  const [showLabel, setShowLabel] = useState(true);
  const [overlayWidth, setOverlayWidth] = useState(0);

  const containerRef = useRef<HTMLSpanElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!isVisible) {
      // Reset to default state for width calculation when the component become visible.
      setShowLabel(true);
      return;
    }

    try {
      // Get the width of the available space to display overlay
      const start = containerRef?.current?.getBoundingClientRect()?.left ?? 0;
      const end = markerRef?.current?.getBoundingClientRect()?.left ?? 0;
      const availableWidth = end - start - PADDING_IN_PX;

      // Get overlay width and label width
      const overlayWidth =
        overlayRef?.current?.getBoundingClientRect()?.width ?? 0;

      // Show label if there is enough space to display
      const shouldShowLabel =
        availableWidth > 0 && overlayWidth > 0
          ? availableWidth > overlayWidth
          : false;
      setShowLabel(shouldShowLabel);

      // We use relative positioning and need to set
      // negative margin left (ltr) as the width of the overlay
      // to make the overlay position on top of inline link.
      const labelWidth = labelRef?.current?.getBoundingClientRect()?.width ?? 0;
      const newOverlayWidth = shouldShowLabel
        ? overlayWidth
        : overlayWidth - labelWidth;
      setOverlayWidth(newOverlayWidth);
    } catch {
      // If something goes wrong, play it safe by hiding label so that
      // the component does not look too janky.
      setShowLabel(false);
    }
  }, [isVisible]);

  const intl = useIntl();
  const label: string = intl.formatMessage(messages.inlineOverlay);

  const icon = useMemo(() => {
    const IconComponent = isToolbarOpen
      ? HipchatChevronUpIcon
      : HipchatChevronDownIcon;

    return (
      <IconComponent
        label={label}
        size="small"
        testId={`${testId}-${isToolbarOpen ? 'open' : 'close'}`}
      />
    );
  }, [isToolbarOpen, label, testId]);

  return (
    <span css={containerStyles} ref={containerRef}>
      {children}
      {isVisible && (
        <React.Fragment>
          <span aria-hidden="true" css={markerStyles} ref={markerRef} />
          <a
            css={[overlayStyles, browser.safari && safariOverlayStyles]}
            style={{ marginLeft: -overlayWidth }}
            data-testid={testId}
            href={url}
            onClick={e => e.preventDefault()}
            ref={overlayRef}
          >
            {showLabel && (
              <span
                css={textStyles}
                data-testid={`${testId}-label`}
                ref={labelRef}
              >
                {label}
              </span>
            )}
            <span css={iconStyles}>{icon}</span>
          </a>
        </React.Fragment>
      )}
    </span>
  );
};

export default InlineCardOverlay;
