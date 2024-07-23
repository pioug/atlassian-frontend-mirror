/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	type CSSProperties,
	type FC,
	type MutableRefObject,
	useCallback,
	useEffect,
	useRef,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import { Box, Inline } from '@atlaskit/primitives';

import type { ProgressDotsProps } from '../types';

import { progressIndicatorGapMap, sizes, varDotsMargin, varDotsSize } from './constants';
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
	const tablistRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

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
			const indicators = Array.from(tablistRef.current!.children) as HTMLButtonElement[];

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

	return (
		<Box
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					[varDotsSize]: `${sizes[size]}px`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					[varDotsMargin]: rawGapValue,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				} as CSSProperties
			}
			role={onSelect && 'tablist'}
		>
			<Inline
				testId={testId}
				ref={(r: HTMLDivElement) => {
					tablistRef.current = r;
				}}
				alignInline="center"
				space={inlineGapValue}
			>
				{values.map((_, index) => {
					const isSelected = selectedIndex === index;
					const tabId = `${ariaLabel}${index}`;
					const panelId = `${ariaControls}${index}`;
					const indicatorTestId = testId && `${testId}-ind-${index}`;

					return onSelect ? (
						<ButtonIndicator
							key={index}
							testId={indicatorTestId}
							appearance={appearance}
							isSelected={isSelected}
							tabId={tabId}
							panelId={panelId}
							onClick={(event) => onSelectWithAnalytics({ event, index })}
						/>
					) : (
						<PresentationalIndicator
							key={index}
							testId={indicatorTestId}
							appearance={appearance}
							isSelected={isSelected}
						/>
					);
				})}
			</Inline>
		</Box>
	);
};

export default ProgressDots;
