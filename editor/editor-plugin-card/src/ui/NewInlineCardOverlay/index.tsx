/* eslint-disable @atlaskit/design-system/no-nested-styles */
/* eslint-disable @atlaskit/design-system/prefer-primitives */
/** @jsx jsx */
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';
import { useIntl } from 'react-intl-next';

import { cardMessages as messages } from '@atlaskit/editor-common/messages';
import { ZERO_WIDTH_JOINER } from '@atlaskit/editor-common/utils';
import type { Size } from '@atlaskit/icon';
import PreferencesIcon from '@atlaskit/icon/glyph/preferences';
import { B100, N0, N700 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { InlineCardOverlayProps } from '../InlineCardOverlay/types';
import {
  getChildElement,
  getIconSize,
  getInlineCardAvailableWidth,
  getOverlayWidths,
  isOneLine,
} from '../InlineCardOverlay/utils';


const DEBOUNCE_IN_MS = 5;
const ESTIMATED_MIN_WIDTH_IN_PX = 16;
const PADDING_IN_PX = 4;
const ICON_WIDTH_IN_PX = 14;
const ICON_AND_LABEL_CLASSNAME = 'ak-editor-card-overlay-icon-and-label';
const OVERLAY_LABEL_CLASSNAME = 'ak-editor-card-overlay-label';
const OVERLAY_MARKER_CLASSNAME = 'ak-editor-card-overlay-marker';
const TEXT_NODE_SELECTOR = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].join(',');
const SMART_LINK_BACKGROUND_COLOR = token('elevation.surface.raised', N0);
// TODO: This should be lighter to match the rest of the button
const SMART_LINK_ACTIVE_COLOR = token('color.background.selected', B100);

const containerStyles = css({
  position: 'relative',
  lineHeight: 'normal',
  ':active': {
    [`.${ICON_AND_LABEL_CLASSNAME}`]: {
      background: SMART_LINK_ACTIVE_COLOR,
    }
  },
});

const overlayStyles = css({
  // Set default styling to be invisible but available in dom for width calculation.
  visibility: 'hidden',

  marginTop: token('space.050', '4px'),
  position: 'absolute',

  verticalAlign: 'text-top',
  height: '1lh',
  '@supports not (height: 1lh)': {
    height: '1.2em',
  },
  overflow: 'hidden',
  // EDM-1717: box-shadow Safari fix bring load wrapper zIndex to 1
  zIndex: 2,
  pointerEvents: 'none',
});

const showOverlayStyles = css({
  visibility: 'visible',
});

const iconStyles = css({
  // Position icon in the middle
  span: {
    display: 'flex',
  },
});

const labelStyles = css({
  fontSize: '0.875em',
  fontWeight: '600',
  width: 'max-content',
});

const iconAndLabelStyles = css({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  marginLeft: token('space.050', '4px'),
  marginRight: token('space.025', '2px'),
  background: SMART_LINK_BACKGROUND_COLOR,
  color: token('color.text.subtlest', N700),
});

const overflowingContainerStyles = css({
  display: 'flex',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  width: 'max-content',
  height: '100%',
});

const NarrowInlineCardOverlay = ({
  children,
  isSelected = false,
  isVisible = false,
  testId = 'inline-card-overlay',
  url,
  ...props
}: React.PropsWithChildren<InlineCardOverlayProps>) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [availableWidth, setAvailableWidth] = useState<number | undefined>(undefined);
  const maxOverlayWidth = useRef(0);
  const minOverlayWidth = useRef(ESTIMATED_MIN_WIDTH_IN_PX);
  const parentWidth = useRef(0);
  const iconSize = useRef<Size>('small');

  const containerRef = useRef<HTMLSpanElement>(null);

  // TODO EDM-9843: Use availableWidth for small link edge case
  availableWidth;

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
      const oneLine = isOneLine(containerRef.current, marker);

      // Get the width of the available space to display overlay.
      // This is the width of the inline link itself. If the inline
      // is wrapped to the next line, this is width of the last line.
      const availableWidth =
        getInlineCardAvailableWidth(containerRef.current, marker) -
        PADDING_IN_PX -
        // Always leave at least the icon visible
        (oneLine ? ICON_WIDTH_IN_PX + PADDING_IN_PX : 0);
      setAvailableWidth(availableWidth);


      const canShowOverlay = !isSelected;
      setShowOverlay(canShowOverlay);
    } catch {
      // If something goes wrong, hide the overlay all together.
      setShowOverlay(false);
    }
  }, [isSelected]);


  useLayoutEffect(() => {
    // Using useLayoutEffect here.
    // 1) We want all to be able to determine whether to display label before
    //    the overlay becomes visible.
    // 2) We need to wait for the refs to be assigned to be able to do determine
    //    the width of the overlay.
    if (!containerRef.current) {
      return;
    }

    // This should run only once
    if (!maxOverlayWidth.current) {
      const iconAndLabel = getChildElement(
        containerRef,
        `.${ICON_AND_LABEL_CLASSNAME}`,
      );
      const label = getChildElement(
        containerRef,
        `.${OVERLAY_LABEL_CLASSNAME}`,
      );

      if (iconAndLabel && label) {
        // Set overlay max (label + icon) and min (icon only) width.
        const { max, min } = getOverlayWidths(iconAndLabel, label);
        maxOverlayWidth.current = max;
        minOverlayWidth.current = min;

        iconSize.current = getIconSize(label);
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

  return (
    <span {...props} css={containerStyles} ref={containerRef}>
      {isVisible && (
        <React.Fragment>
          <span aria-hidden="true" className={OVERLAY_MARKER_CLASSNAME}>
            {ZERO_WIDTH_JOINER}
          </span>
          <a
            css={[overlayStyles, showOverlay && showOverlayStyles]}
            data-testid={testId}
            href={url}
            onClick={e => e.preventDefault()}
            tabIndex={-1}
          >
            <span css={overflowingContainerStyles}>
              <span
                css={iconAndLabelStyles}
                className={ICON_AND_LABEL_CLASSNAME}
              >
                <span css={iconStyles}>
                  <PreferencesIcon
                    label={label}
                    size={iconSize.current}
                    testId={`${testId}-icon`}
                  />
                </span>
                {(
                  <span
                    css={labelStyles}
                    className={OVERLAY_LABEL_CLASSNAME}
                    data-testid={`${testId}-label`}
                  >
                  </span>
                )}
              </span>
            </span>
          </a>
        </React.Fragment>
      )}
      {children}
    </span>
  );
};

export default NarrowInlineCardOverlay;
