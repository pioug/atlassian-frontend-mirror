/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { css, jsx } from '@compiled/react';

import IconButton from '@atlaskit/button/icon/button';
import { ruleMessages as messages } from '@atlaskit/editor-common/messages/rule';
import StrokeWeightLargeIcon from '@atlaskit/icon/core/stroke-weight-large';
import StrokeWeightMediumIcon from '@atlaskit/icon/core/stroke-weight-medium';
import StrokeWeightSmallIcon from '@atlaskit/icon/core/stroke-weight-small';
import type { IconProps } from '@atlaskit/icon/types';

import { cssMap } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import {
	DEFAULT_DIVIDER_STYLE,
	DEFAULT_DIVIDER_WEIGHT,
	type DividerStyle,
	type DividerWeight,
} from './constants';
import { FadeStrokeIcon } from './icons/FadeStrokeIcon';
import { SketchStrokeIcon } from './icons/SketchStrokeIcon';
import { SolidStrokeIcon } from './icons/SolidStrokeIcon';
import { DashedStrokeIcon } from './icons/DashedStrokeIcon';
import { DottedStrokeIcon } from './icons/DottedStrokeIcon';

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
	overflow: 'hidden',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > button': {
		borderRadius: token('radius.large'),
		justifyContent: 'center',
		width: '100%',
	},
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
	icon: React.ComponentType<IconProps>;
	isSelected: boolean;
	label: string;
	onSelect?: (value: Value) => void;
	value: Value;
};

const DividerOptionButton = <Value extends DividerWeight | DividerStyle>({
	icon,
	isSelected,
	label,
	onSelect,
	value,
}: DividerOptionButtonProps<Value>): React.JSX.Element => {
	const handleClick = useCallback(() => onSelect?.(value), [onSelect, value]);
	return (
		<div css={dividerOptionsButtonStyles}>
			<IconButton icon={icon} isSelected={isSelected} label={label} onClick={handleClick} />
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

	const selectedStyle = style ?? DEFAULT_DIVIDER_STYLE;
	const selectedWeight = weight ?? DEFAULT_DIVIDER_WEIGHT;

	return (
		<Box xcss={styles.container}>
			<Box xcss={styles.section}>
				<Text weight="bold" color="color.text.subtle">
					{formatMessage(messages.weight)}
				</Text>
				<Box xcss={styles.dividerOptionsButtonContainer}>
					<Box xcss={styles.dividerOptionsContainer}>
						{weightOptions.map(({ icon, label, value }) => (
							<DividerOptionButton
								key={value}
								icon={icon}
								isSelected={selectedWeight === value}
								label={formatMessage(label)}
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
