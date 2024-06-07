import React, { useEffect, useMemo, useState } from 'react';

import { Label } from '@atlaskit/form';
import { Box, Flex, xcss } from '@atlaskit/primitives';
import Range from '@atlaskit/range';

import { ToggleBox } from './toggle';

const boxStyles = xcss({ width: '25%', padding: 'space.025' });
const wrapperStyles = xcss({ padding: 'space.025' });

const pixelRange = [1, 1600];
const percentRange = [1, 100];

type OnValue = (value: string | undefined) => void;

const defaultVlue = 500;

export const DimensionPicker = ({
	targetName,
	dimensionName,
	onChange,
	initialValue,
	initialUnit,
}: {
	initialValue?: number;
	initialUnit?: '%' | 'px';
	targetName: string;
	dimensionName: string;
	onChange: OnValue;
}) => {
	const rangeId = `range-${targetName}-${dimensionName}`;

	const [isPercent, setIsPercent] = useState(initialUnit === '%');
	const [rawValue, setRawValue] = useState<number | undefined>(initialValue);
	const rangeValues = useMemo(() => (isPercent ? percentRange : pixelRange), [isPercent]);

	const value = useMemo(
		() => (isPercent && !!rawValue && rawValue > 100 ? 100 : rawValue),
		[isPercent, rawValue],
	);
	const unit = useMemo(() => (isPercent ? '%' : 'px'), [isPercent]);

	useEffect(() => {
		onChange(value === undefined ? value : `${value}${unit}`);
	}, [value, unit, onChange]);

	return (
		<Box xcss={boxStyles}>
			<Label htmlFor={rangeId}>
				{targetName} {dimensionName}: {value ? `${value} ${isPercent ? '%' : 'px'}` : 'Not set'}
			</Label>
			<ToggleBox label="Use %" defaultChecked={initialUnit === '%'} onChange={setIsPercent} />
			<ToggleBox
				label="Unset"
				defaultChecked={!initialValue}
				onChange={(value) => {
					value ? setRawValue(undefined) : setRawValue(defaultVlue);
				}}
			/>
			{rawValue && (
				<Range
					id={rangeId}
					step={1}
					min={rangeValues[0]}
					max={rangeValues[1]}
					onChange={setRawValue}
					value={value}
				/>
			)}
		</Box>
	);
};

export const DimensionsPicker = ({
	onContainerWidth,
	onContainerHeight,
	onImageWidth,
	onImageHeight,
}: {
	onContainerWidth: OnValue;
	onContainerHeight: OnValue;
	onImageWidth: OnValue;
	onImageHeight: OnValue;
}) => {
	return (
		<Flex alignItems="stretch" direction="row" xcss={wrapperStyles}>
			<DimensionPicker
				targetName="Container"
				dimensionName="width"
				onChange={onContainerWidth}
				initialValue={defaultVlue}
			/>
			<DimensionPicker
				targetName="Container"
				dimensionName="height"
				onChange={onContainerHeight}
				initialValue={defaultVlue}
			/>
			<DimensionPicker
				targetName="Image"
				dimensionName="width"
				onChange={onImageWidth}
				initialValue={80}
				initialUnit="%"
			/>
			<DimensionPicker
				targetName="Image"
				dimensionName="height"
				onChange={onImageHeight}
				initialValue={80}
				initialUnit="%"
			/>
		</Flex>
	);
};
