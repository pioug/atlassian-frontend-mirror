/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useContext, useRef } from 'react';

import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

import IconButton from '@atlaskit/button/icon/button';
import { cssMap } from '@atlaskit/css';
import { ruleMessages as messages } from '@atlaskit/editor-common/messages/rule';
import ReactEditorViewContext from '@atlaskit/editor-common/ui-react/ReactEditorViewContext';
import StrokeWeightLargeIcon from '@atlaskit/icon/core/stroke-weight-large';
import StrokeWeightMediumIcon from '@atlaskit/icon/core/stroke-weight-medium';
import StrokeWeightSmallIcon from '@atlaskit/icon/core/stroke-weight-small';
import type { IconProps } from '@atlaskit/icon/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import {
	DEFAULT_DIVIDER_STYLE,
	DEFAULT_DIVIDER_WEIGHT,
	type DividerStyle,
	type DividerWeight,
} from './constants';
import { DashedStrokeIcon } from './icons/DashedStrokeIcon';
import { DottedStrokeIcon } from './icons/DottedStrokeIcon';
import { FadeStrokeIcon } from './icons/FadeStrokeIcon';
import { SketchStrokeIcon } from './icons/SketchStrokeIcon';
import { SolidStrokeIcon } from './icons/SolidStrokeIcon';

type DividerOptionsProps = {
	onStyleChange?: (style: DividerStyle) => void;
	onWeightChange?: (weight: DividerWeight) => void;
	style?: DividerStyle | null;
	weight?: DividerWeight | null;
};

const styles = cssMap({
	container: {
		height: '176px',
		paddingInline: token('space.150'),
	},
	section: {
		paddingBlock: token('space.050'),
	},
	dividerOptionsContainer: {
		display: 'flex',
		gap: token('space.100'),
		width: '100%',
	},
	dividerOptionsButtonContainer: {
		paddingBlock: token('space.050'),
	},
});

const dividerOptionsButtonStyles = css({
	borderRadius: token('radius.large'),
	flexGrow: 1,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > button': {
		borderRadius: token('radius.large'),
		justifyContent: 'center',
		width: '100%',
	},
});

const dividerOptionsButtonStylesOld = css({
	overflow: 'hidden',
});

const SmallWeightIcon = (iconProps: IconProps) => (
	<StrokeWeightSmallIcon color={token('color.icon.subtle')} label={iconProps.label} />
);

const MediumWeightIcon = (iconProps: IconProps) => (
	<StrokeWeightMediumIcon color={token('color.icon.subtle')} label={iconProps.label} />
);

const LargeWeightIcon = (iconProps: IconProps) => (
	<StrokeWeightLargeIcon color={token('color.icon.subtle')} label={iconProps.label} />
);

const weightOptions = [
	{ icon: SmallWeightIcon, label: messages.smallDivider, value: 1 },
	{ icon: MediumWeightIcon, label: messages.mediumDivider, value: 2 },
	{ icon: LargeWeightIcon, label: messages.largeDivider, value: 3 },
] as const;

const styleOptionRows = [
	// row 1
	[
		{ icon: SolidStrokeIcon, label: messages.solidDivider, value: 'solid' },
		{ icon: DashedStrokeIcon, label: messages.dashedDivider, value: 'dashed' },
		{ icon: DottedStrokeIcon, label: messages.dottedDivider, value: 'dotted' },
	],
	// row 2
	[
		{ icon: SketchStrokeIcon, label: messages.sketchDivider, value: 'sketch' },
		{ icon: FadeStrokeIcon, label: messages.fadeDivider, value: 'fade' },
	],
] as const;

type DividerOptionButtonProps<Value extends DividerWeight | DividerStyle> = {
	autoFocus?: boolean;
	icon: React.ComponentType<IconProps>;
	isSelected: boolean;
	label: string;
	onKeyDownCapture?: React.KeyboardEventHandler;
	onSelect?: (value: Value) => void;
	value: Value;
};

const DividerOptionButton = <Value extends DividerWeight | DividerStyle>({
	autoFocus,
	icon,
	isSelected,
	label,
	onKeyDownCapture,
	onSelect,
	value,
}: DividerOptionButtonProps<Value>): React.JSX.Element => {
	const handleClick = useCallback(() => onSelect?.(value), [onSelect, value]);
	return (
		<div
			css={[
				dividerOptionsButtonStyles,
				!isExperimentEnabled('platform_editor_lovability_dividers_patch_1') &&
					dividerOptionsButtonStylesOld,
			]}
		>
			<IconButton
				autoFocus={autoFocus}
				icon={icon}
				isSelected={isSelected}
				label={label}
				onClick={handleClick}
				onKeyDownCapture={onKeyDownCapture}
			/>
		</div>
	);
};

export const DividerOptions = ({
	onStyleChange,
	onWeightChange,
	style,
	weight,
}: DividerOptionsProps): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const { popupsMountPoint } = useContext(ReactEditorViewContext);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
		const buttons = Array.from(
			containerRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [],
		);
		const index = buttons.indexOf(event.currentTarget);
		if (index === -1) {
			return;
		}

		const columns = weightOptions.length;
		const row = Math.floor(index / columns);
		const column = index % columns;
		const rows = [weightOptions, ...styleOptionRows];
		let nextIndex: number;

		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp': {
				const nextRow = (row + (event.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length;
				nextIndex = nextRow * columns + Math.min(column, rows[nextRow].length - 1);
				break;
			}
			case 'ArrowRight':
				nextIndex = (index + 1) % buttons.length;
				break;
			case 'ArrowLeft':
				nextIndex = (index - 1 + buttons.length) % buttons.length;
				break;
			default:
				return;
		}

		event.preventDefault();
		event.stopPropagation();
		buttons[nextIndex]?.focus();
	}, []);

	const selectedStyle = style ?? DEFAULT_DIVIDER_STYLE;
	const selectedWeight = weight ?? DEFAULT_DIVIDER_WEIGHT;
	const isPatchEnabled = isExperimentEnabled('platform_editor_lovability_dividers_patch_1');

	return (
		<Box
			xcss={styles.container}
			ref={isPatchEnabled ? containerRef : undefined}
			role={isPatchEnabled ? 'group' : undefined}
			aria-label={isPatchEnabled ? formatMessage(messages.dividerOptions) : undefined}
		>
			<Box xcss={styles.section}>
				<Text weight="bold" color="color.text.subtle">
					{formatMessage(messages.weight)}
				</Text>
				<Box xcss={styles.dividerOptionsButtonContainer}>
					<Box xcss={styles.dividerOptionsContainer}>
						{weightOptions.map(({ icon, label, value }) => (
							<DividerOptionButton
								key={value}
								autoFocus={
									// when there is no custom mount point, Dropdown sends ArrowDown
									// on keyboard open so autofocusing is not required.
									isPatchEnabled && Boolean(popupsMountPoint) && value === weightOptions[0].value
								}
								icon={icon}
								isSelected={selectedWeight === value}
								label={formatMessage(label)}
								onKeyDownCapture={isPatchEnabled ? handleKeyDown : undefined}
								onSelect={onWeightChange}
								value={value}
							/>
						))}
					</Box>
				</Box>
			</Box>
			<Box xcss={styles.section}>
				<Text weight="bold" color="color.text.subtle">
					{formatMessage(messages.style)}
				</Text>
				{styleOptionRows.map((options) => (
					<Box key={options[0].value} xcss={styles.dividerOptionsButtonContainer}>
						<Box xcss={styles.dividerOptionsContainer}>
							{options.map(({ icon, label, value }) => (
								<DividerOptionButton
									key={value}
									icon={icon}
									isSelected={selectedStyle === value}
									label={formatMessage(label)}
									onKeyDownCapture={isPatchEnabled ? handleKeyDown : undefined}
									onSelect={onStyleChange}
									value={value}
								/>
							))}
						</Box>
					</Box>
				))}
			</Box>
		</Box>
	);
};
