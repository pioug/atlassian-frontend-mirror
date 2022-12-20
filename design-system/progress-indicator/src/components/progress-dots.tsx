/** @jsx jsx */
import React, {
  CSSProperties,
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import Box from '@atlaskit/ds-explorations/box';
import Inline from '@atlaskit/ds-explorations/inline';
import noop from '@atlaskit/ds-lib/noop';
import { useGlobalTheme } from '@atlaskit/theme/components';

import type { ProgressDotsProps } from '../types';

import { getBgColor } from './appearances';
import {
  progressIndicatorGapMap,
  sizes,
  varDotsMargin,
  varDotsSize,
} from './constants';
import { ButtonIndicator, PresentationalIndicator } from './indicator';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

/**
 * __ProgressDots__
 *
 * A progress indicator shows the user where they are along the steps of a journey.
 */
const ProgressDots: FC<ProgressDotsProps> = ({
  appearance = 'default',
  ariaControls = 'panel',
  ariaLabel = 'tab',
  size = 'default',
  // NOTE: `spacing` is a reserved HTML attribute and will be added to the
  // element, replaced with `gutter`.
  spacing: gutter = 'comfortable',
  selectedIndex,
  testId,
  values,
  onSelect,
}) => {
  const tablistRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);

  const onSelectWithAnalytics = usePlatformLeafEventHandler({
    fn: onSelect || noop,
    action: 'selected',
    componentName: 'progressIndicator',
    packageName,
    packageVersion,
  });

  const [inlineGapValue, rawGapValue] = progressIndicatorGapMap[gutter][size];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const indicators = Array.from(
        tablistRef.current!.children,
      ) as HTMLButtonElement[];

      // bail if the target isn't an indicator
      if (!indicators.includes(event.target as HTMLButtonElement)) {
        return;
      }

      // bail if not valid arrow key
      const isLeft = event.key === 'ArrowLeft';
      const isRight = event.key === 'ArrowRight';
      if (!isLeft && !isRight) {
        return;
      }

      // bail if at either end of the values
      const isAlpha = isLeft && selectedIndex === 0;
      const isOmega = isRight && selectedIndex === values.length - 1;
      if (isAlpha || isOmega) {
        return;
      }

      const index = isLeft ? selectedIndex - 1 : selectedIndex + 1;

      // call the consumer's select method and focus the applicable indicator
      if (onSelect) {
        onSelectWithAnalytics({
          event: event as unknown as React.MouseEvent<HTMLButtonElement>,
          index,
        });
      }

      if (typeof indicators[index].focus === 'function') {
        indicators[index].focus();
      }
    },
    [onSelectWithAnalytics, selectedIndex, values, onSelect],
  );

  useEffect(() => {
    if (!onSelect) {
      return noop;
    }
    return bind(document, {
      type: 'keydown',
      listener: handleKeyDown,
      options: { capture: false },
    });
  }, [onSelect, handleKeyDown]);

  const theme = useGlobalTheme();

  return (
    <Box
      UNSAFE_style={
        {
          [varDotsSize]: `${sizes[size]}px`,
          [varDotsMargin]: rawGapValue,
        } as CSSProperties
      }
      display="block"
      role="tablist"
    >
      <Inline
        testId={testId}
        ref={(r: HTMLDivElement) => {
          tablistRef.current = r;
        }}
        justifyContent="center"
        gap={inlineGapValue}
      >
        {values.map((_, index) => {
          const isSelected = selectedIndex === index;
          const tabId = `${ariaLabel}${index}`;
          const panelId = `${ariaControls}${index}`;
          const backgroundColor = getBgColor(appearance, isSelected)({ theme });

          return onSelect ? (
            <ButtonIndicator
              key={index}
              style={{ backgroundColor }}
              aria-controls={panelId}
              aria-label={tabId}
              aria-selected={isSelected}
              id={tabId}
              onClick={(event) => onSelectWithAnalytics({ event, index })}
              tabIndex={isSelected ? 0 : -1}
              data-testid={testId && `${testId}-ind-${index}`}
            />
          ) : (
            <PresentationalIndicator
              data-testid={testId && `${testId}-ind-${index}`}
              key={index}
              style={{ backgroundColor }}
            />
          );
        })}
      </Inline>
    </Box>
  );
};

export default ProgressDots;
