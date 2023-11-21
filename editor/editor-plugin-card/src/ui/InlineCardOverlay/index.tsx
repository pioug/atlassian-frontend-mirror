/** @jsx jsx */
import type { FC } from 'react';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';
import { useIntl } from 'react-intl-next';

import { browser } from '@atlaskit/editor-common/utils';
import HipchatChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import HipchatChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import { N20A, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../../messages';

import type { InlineCardOverlayProps } from './types';
import {
  getChildElement,
  getInlineCardAvailableWidth,
  getOverlayWidths,
} from './utils';

const DEBOUNCE_IN_MS = 5;
const ESTIMATED_MIN_WIDTH_IN_PX = 16;
const PADDING_IN_PX = 2;
const OVERLAY_CLASSNAME = 'ak-editor-card-overlay';
const OVERLAY_LABEL_CLASSNAME = 'ak-editor-card-overlay-label';
const OVERLAY_MARKER_CLASSNAME = 'ak-editor-card-overlay-marker';
const TEXT_NODE_SELECTOR = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].join(',');

const containerStyles = css({
  position: 'relative',
  lineHeight: 'normal',
});

const linkStyles = css({
  color: token('color.text', '#172B4D'),
  textDecoration: 'none',
});

const overlayStyles = css({
  // Visibility is set directly on element via style prop
  display: 'inline-flex',

  // Positioning
  position: 'relative',
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
  isSelected = false,
  isVisible = false,
  testId = 'inline-card-overlay',
  url,
  ...props
}) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [showLabel, setShowLabel] = useState(true);
  const [overlayWidth, setOverlayWidth] = useState(0);

  const maxOverlayWidth = useRef(0);
  const minOverlayWidth = useRef(ESTIMATED_MIN_WIDTH_IN_PX);
  const parentWidth = useRef(0);

  const containerRef = useRef<HTMLSpanElement>(null);

  const setVisibility = useCallback(() => {
    if (!containerRef.current || !maxOverlayWidth.current) {
      return;
    }

    const marker = getChildElement(
      containerRef,
      `.${OVERLAY_MARKER_CLASSNAME}`,
    );
    if (!marker) {
      return;
    }

    try {
      // Get the width of the available space to display overlay.
      // This is the width of the inline link itself. If the inline
      // is wrapped to the next line, this is width of the last line.
      const availableWidth =
        getInlineCardAvailableWidth(containerRef.current, marker) -
        PADDING_IN_PX;

      // If available width is less than the min width of overlay, don't show overlay.
      const canShowOverlay = availableWidth > minOverlayWidth.current;
      setShowOverlay(canShowOverlay);

      if (!canShowOverlay) {
        return;
      }

      // Otherwise, check if overlay can be show in full context with label and icon.
      const canShowLabel =
        availableWidth > maxOverlayWidth.current + PADDING_IN_PX;
      setShowLabel(canShowLabel);
      setOverlayWidth(
        canShowLabel ? maxOverlayWidth.current : minOverlayWidth.current,
      );
    } catch {
      // If something goes wrong, hide the overlay all together.
      setShowOverlay(false);
    }
  }, []);

  useLayoutEffect(() => {
    // Using useLayoutEffect here.
    // 1) We want all to be able to determine whether to display label before
    //    the overlay becomes visible.
    // 2) We need to wait for the refs to be assigned to be able to do determine
    //    the width of the overlay.
    if (!containerRef.current) {
      return;
    }

    if (!maxOverlayWidth.current) {
      const overlay = getChildElement(containerRef, `.${OVERLAY_CLASSNAME}`);
      const label = getChildElement(
        containerRef,
        `.${OVERLAY_LABEL_CLASSNAME}`,
      );

      if (overlay && label) {
        // Set overlay max (label + icon) and min (icon only) width.
        // This should run only once.
        const { max, min } = getOverlayWidths(overlay, label);
        maxOverlayWidth.current = max;
        minOverlayWidth.current = min;
      }
    }

    if (isVisible) {
      setVisibility();
    }
  }, [setVisibility, isVisible]);

  useEffect(() => {
    // Find the closest block parent to observe size change
    const parent = containerRef?.current?.closest(TEXT_NODE_SELECTOR);
    if (!parent) {
      return;
    }

    const updateOverlay = debounce(entries => {
      if (!isVisible) {
        return;
      }

      const size = entries?.[0]?.contentBoxSize?.[0]?.inlineSize;
      if (!size) {
        return;
      }

      if (!parentWidth.current) {
        parentWidth.current = size;
      }

      if (parentWidth.current === size) {
        return;
      }

      parentWidth.current = size;
      setVisibility();
    }, DEBOUNCE_IN_MS);

    const observer = new ResizeObserver(updateOverlay);
    observer.observe(parent);
    return () => {
      observer.disconnect();
    };
  }, [isVisible, setVisibility]);

  const intl = useIntl();
  const label: string = intl.formatMessage(messages.inlineOverlay);

  const icon = useMemo(() => {
    const IconComponent = isSelected
      ? HipchatChevronUpIcon
      : HipchatChevronDownIcon;

    return (
      <IconComponent
        label={label}
        size="small"
        testId={`${testId}-${isSelected ? 'open' : 'close'}`}
      />
    );
  }, [isSelected, label, testId]);

  return (
    <span {...props} css={containerStyles} ref={containerRef}>
      {children}
      {isVisible && showOverlay && (
        <React.Fragment>
          <span
            aria-hidden="true"
            className={OVERLAY_MARKER_CLASSNAME}
            css={markerStyles}
          />
          <a
            className={OVERLAY_CLASSNAME}
            css={[overlayStyles, browser.safari && safariOverlayStyles]}
            style={{ marginLeft: -overlayWidth }}
            data-testid={testId}
            href={url}
            onClick={e => e.preventDefault()}
            tabIndex={-1}
          >
            {showLabel && (
              <span
                className={OVERLAY_LABEL_CLASSNAME}
                css={textStyles}
                data-testid={`${testId}-label`}
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
