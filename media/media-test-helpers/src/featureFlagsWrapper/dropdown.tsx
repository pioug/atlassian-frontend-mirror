import React, { type PropsWithChildren, useState } from 'react';
import Textfield from '@atlaskit/textfield';
import { type MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import { getMediaFeatureFlags, clearAllLocalFeatureFlags, setLocalFeatureFlag } from './helpers';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import HipchatChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import Button from '@atlaskit/button/standard-button';
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

const ItemWrapper = ({ children }: PropsWithChildren<{}>) => (
	<div style={{ padding: `10px ${token('space.250', '20px')}` }}>{children}</div>
);

const CheckboxItem = ({
	name,
	initialValue,
	onChange,
}: {
	name: keyof MediaFeatureFlags;
	initialValue: boolean;
	onChange: () => void;
}) => (
	<ItemWrapper>
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
	</ItemWrapper>
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
		<ItemWrapper>
			<label htmlFor={`media-feature-flag-text-${name}`}>{camelCaseToSentenceCase(name)}:</label>
			<Textfield
				name={`media-feature-flag-text-${name}`}
				defaultValue={value}
				onChange={(e) => fieldChanged(e.currentTarget.value)}
				type={isNumber ? 'number' : 'text'}
			/>
		</ItemWrapper>
	);
};

const FeatureFlagItems = ({ onUpdate }: { onUpdate: () => void }) => {
	const flagItems = Object.entries(getMediaFeatureFlags());

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ maxHeight: '200px', padding: '10px 0' }}>
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
				<ItemWrapper>No flags available</ItemWrapper>
			)}
		</div>
	);
};

export type MediaFeatureFlagsDropdownProps = {
	onFlagChanged: () => void;
};

const MediaFeatureFlagsDropdown = ({ onFlagChanged }: MediaFeatureFlagsDropdownProps) => {
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
						iconAfter={<HipchatChevronDownIcon label="" size="small" />}
					>
						Media Feature Flags
					</Button>
				)}
			/>
			<Tooltip content="Reset all flags">
				<Button
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ marginLeft: 10 }}
					iconBefore={<SelectClearIcon label="Star icon" size="small" />}
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
