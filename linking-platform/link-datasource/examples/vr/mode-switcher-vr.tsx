/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { ModeSwitcher } from '../../src/ui/common/modal/mode-switcher';

const exampleModes = [
	{ value: 'basic', label: 'Basic' },
	{ value: 'jql', label: 'JQL' },
	{ value: 'other', label: 'Other' },
];

const exampleModesWithOptionsDisabled = [
	{ value: 'basic', label: 'Basic' },
	{ value: 'jql', label: 'JQL', disabled: true },
	{ value: 'other', label: 'Other' },
];

const containerStyles = css({
	display: 'flex',
	flexDirection: 'column',
});

const lineStyles = css({
	marginTop: token('space.150', '12px'),
	marginRight: token('space.150', '12px'),
	marginBottom: token('space.150', '12px'),
	marginLeft: token('space.150', '12px'),
});

export default () => {
	const [currentMode, setCurrentMode] = useState('basic');

	const onModeChange = (selectedMode: string) => {
		setCurrentMode(selectedMode);
	};

	return (
		<div css={containerStyles} data-testid={'mode-switcher-example-container'}>
			<div css={lineStyles}>
				<ModeSwitcher
					isCompact={false}
					options={exampleModes}
					onOptionValueChange={onModeChange}
					selectedOptionValue={currentMode}
				/>
			</div>
			<div css={lineStyles}>
				<ModeSwitcher
					isCompact={true}
					options={exampleModes}
					onOptionValueChange={onModeChange}
					selectedOptionValue={currentMode}
				/>
			</div>
			<div css={lineStyles}>
				<ModeSwitcher
					isCompact={false}
					options={exampleModesWithOptionsDisabled}
					onOptionValueChange={onModeChange}
					selectedOptionValue={currentMode}
				/>
			</div>
			<div css={lineStyles}>
				<ModeSwitcher
					isDisabled={true}
					options={exampleModes}
					onOptionValueChange={onModeChange}
					selectedOptionValue={currentMode}
				/>
			</div>
		</div>
	);
};
