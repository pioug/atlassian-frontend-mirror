import React, { useState } from 'react';
import Textfield from '@atlaskit/textfield';
import { type MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import { getMediaFeatureFlags, clearAllLocalFeatureFlags, setLocalFeatureFlag } from './helpers';
import SelectClearIcon from '@atlaskit/icon/core/cross-circle';
import HipchatChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import Button from '@atlaskit/button/standard-button';
import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import Popup from '@atlaskit/popup';
import { Checkbox } from '@atlaskit/checkbox';
import { debounce } from '@atlaskit/media-common';

const camelCaseToSentenceCase = (text: string) => {
	var result = text.replace(/([A-Z])/g, ' $1');
	return result.charAt(0).toUpperCase() + result.slice(1);
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
	display: 'flex',
	flexDirection: 'row',
	margin: `${token('space.250', '20px')} auto`,
});

const CheckboxItem = ({
	name,
	initialValue,
	onChange,
}: {
	name: keyof MediaFeatureFlags;
	initialValue: boolean;
	onChange: () => void;
}) => (
	<Checkbox
		defaultChecked={initialValue}
		label={camelCaseToSentenceCase(name)}
		onChange={() => {
			const value = !initialValue;
			setLocalFeatureFlag(name, value);
			onChange();
		}}
		name={`media-feature-flag-check-${name}`}
	/>
);

const TextFieldItem = ({
	name,
	value,
	isNumber,
	onChange,
}: {
	name: keyof MediaFeatureFlags;
	value: string;
	onChange: () => void;
	isNumber?: boolean;
}) => {
	const fieldChanged = debounce((newValue: string) => {
		const formattedValue = isNumber ? (isNaN(Number(newValue)) ? 0 : Number(newValue)) : newValue;
		setLocalFeatureFlag(name, formattedValue);
		onChange();
	}, 500);

	return (
		<div>
			<label htmlFor={`media-feature-flag-text-${name}`}>{camelCaseToSentenceCase(name)}:</label>
			<Textfield
				name={`media-feature-flag-text-${name}`}
				defaultValue={value}
				onChange={(e) => fieldChanged(e.currentTarget.value)}
				type={isNumber ? 'number' : 'text'}
			/>
		</div>
	);
};

const FeatureFlagItems = ({ onUpdate }: { onUpdate: () => void }) => {
	const flagItems = Object.entries(getMediaFeatureFlags());

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<Stack xcss={featureFlagItemStyles}>
			{flagItems.length > 0 ? (
				flagItems.map(([key, currentValue]) => {
					const name = key as keyof MediaFeatureFlags;
					const ffType = typeof currentValue;
					const isNumber = ffType === 'number';
					switch (ffType) {
						case 'boolean':
							return (
								<CheckboxItem
									key={`media-feature-flag-item-${name}`}
									name={name}
									initialValue={currentValue}
									onChange={onUpdate}
								/>
							);
						case 'number':
						case 'string':
							return (
								<TextFieldItem
									key={`media-feature-flag-item-${name}`}
									name={name}
									value={currentValue}
									onChange={onUpdate}
									isNumber={isNumber}
								/>
							);
					}
				})
			) : (
				<div>No flags available</div>
			)}
		</Stack>
	);
};

const featureFlagItemStyles = xcss({
	maxHeight: '200px',
	gap: 'space.100',
	padding: 'space.150',
});

export type MediaFeatureFlagsDropdownProps = {
	onFlagChanged: () => void;
};

const MediaFeatureFlagsDropdown = ({
	onFlagChanged,
}: MediaFeatureFlagsDropdownProps): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Container>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				placement="bottom-start"
				content={() => <FeatureFlagItems onUpdate={onFlagChanged} />}
				trigger={(triggerProps) => (
					<Button
						{...triggerProps}
						isSelected={isOpen}
						onClick={() => setIsOpen(!isOpen)}
						iconAfter={
							<HipchatChevronDownIcon
								color="currentColor"
								label=""
								LEGACY_size="small"
								size="small"
							/>
						}
					>
						Media Feature Flags
					</Button>
				)}
				shouldRenderToParent={fg('should-render-to-parent-should-be-true-media-exif')}
			/>
			<Tooltip content="Reset all flags">
				<Button
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ marginLeft: 10 }}
					iconBefore={
						<SelectClearIcon color="currentColor" label="Star icon" LEGACY_size="small" />
					}
					onClick={() => {
						clearAllLocalFeatureFlags();
						onFlagChanged();
					}}
				></Button>
			</Tooltip>
		</Container>
	);
};

export default MediaFeatureFlagsDropdown;
