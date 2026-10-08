/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type JSX, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import IconButton from '@atlaskit/button/icon/button';
import { cssMap, cx } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/core/cross';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

const styles = css({
	width: '40px',
	height: '40px',
	padding: 0,
	position: 'absolute',
	insetBlockStart: 0,
	opacity: 0,
});

const optionStyles = cssMap({
	container: {
		position: 'relative',
	},
	swatch: {
		marginBlockStart: token('space.075'),
		marginBlockEnd: token('space.075'),
		marginInlineEnd: token('space.075'),
		marginInlineStart: 0,
		width: '28px',
		height: '28px',
		// @ts-expect-error - this is a valid value
		border: `2px solid ${token('color.border')}`,
		borderRadius: token('radius.small'),
	},
	undefinedSwatch: {
		backgroundColor: 'transparent',
		backgroundImage:
			'linear-gradient(to bottom right, transparent 48%, red 48%, red 52%, transparent 52%)',
		backgroundRepeat: 'no-repeat',
	},
});

const labelStyles = css({
	color: token('color.text'),
	font: token('font.heading.xsmall'),
	fontWeight: token('font.weight.bold'),
});

const COLOR_PICKER_DELAY = 200;

export interface ColorInputProps {
	id: string;
	value: string;
	onChange: (value: string) => void;
	name: string;
	description: string;
}

export const ColorInput = ({
	id,
	value,
	onChange,
	name,
	description,
}: ColorInputProps): JSX.Element => {
	const [currentValue, setCurrentValue] = useState(value);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const lastUpdateTimeRef = useRef<number>(0);

	// Sync state when value prop changes
	useEffect(() => {
		setCurrentValue(value);
	}, [value]);

	// Cleanup debounce timer on unmount
	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	const throttledOnChange = (newValue: string) => {
		setCurrentValue(newValue);
		const now = Date.now();
		const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

		// Clear any pending debounced call
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		if (timeSinceLastUpdate >= COLOR_PICKER_DELAY) {
			// Enough time has passed, update immediately
			lastUpdateTimeRef.current = now;
			onChange(newValue);
		} else {
			// Schedule an update after the remaining time
			const remainingTime = COLOR_PICKER_DELAY - timeSinceLastUpdate;
			debounceTimerRef.current = setTimeout(() => {
				lastUpdateTimeRef.current = Date.now();
				onChange(newValue);
			}, remainingTime);
		}
	};

	const immediateOnChange = (newValue: string) => {
		setCurrentValue(newValue);
		// Clear any pending throttled call
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
			debounceTimerRef.current = null;
		}
		lastUpdateTimeRef.current = Date.now();
		// Update immediately for text field (when valid hex) or remove button
		onChange(newValue);
	};

	return (
		<Stack space="space.050">
			<label htmlFor={id} css={labelStyles}>
				{name}
			</label>
			<Inline space="space.100" alignBlock="center">
				<Box xcss={optionStyles.container}>
					<Box
						xcss={cx(optionStyles.swatch, !value && optionStyles.undefinedSwatch)}
						style={{ backgroundColor: value }}
					/>
					<input
						css={styles}
						type="color"
						// The visible label is attached to the text field, so name the picker separately.
						aria-label={`${name} picker`}
						value={value || '#ffffff'}
						onChange={(e) => {
							throttledOnChange(e.currentTarget.value);
						}}
					/>
				</Box>
				<Textfield
					id={id}
					value={currentValue}
					width={'180px'}
					onChange={(e) => {
						const newValue = e.currentTarget.value;
						setCurrentValue(newValue);
						if (newValue.match(/^#[0-9a-fA-F]{6}$/)) {
							immediateOnChange(newValue);
						}
						if (newValue === '') {
							setCurrentValue('');
							immediateOnChange('');
						}
					}}
				/>
				<IconButton
					icon={CrossIcon}
					label="Remove"
					onClick={() => {
						immediateOnChange('');
					}}
				/>
			</Inline>
			<Text as="p" size="small">
				{description}
			</Text>
		</Stack>
	);
};
