/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import Button, { IconButton } from '@atlaskit/button/new';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import { token } from '@atlaskit/tokens';

import { PopupSelect } from '../src';

const regions = [
	{
		label: 'States',
		options: [
			{ label: 'Adelaide', value: 'adelaide' },
			{ label: 'Brisbane', value: 'brisbane' },
			{ label: 'Melbourne', value: 'melbourne' },
			{ label: 'Perth', value: 'perth' },
			{ label: 'Sydney', value: 'sydney' },
			{ label: 'Hobart', value: 'hobart' },
		],
	},
	{
		label: 'Territories',
		options: [
			{ label: 'Canberra', value: 'canberra' },
			{ label: 'Darwin', value: 'darwin' },
		],
	},
];

const onChange = console.log;
const defaults = {
	options: regions,
	placeholder: 'Choose a City',
	onChange,
};

const flexStyles = css({ display: 'flex' });

const spaceBetweenStyles = css({
	justifyContent: 'space-between',
});

const PopupSelectExample = () => (
	<Fragment>
		<div css={[flexStyles, spaceBetweenStyles]}>
			<PopupSelect
				{...defaults}
				value={regions[0].options[0]}
				target={({ isOpen, ...triggerProps }) => (
					<Button isSelected={isOpen} {...triggerProps} testId="button-for-testing">
						Target1
					</Button>
				)}
				popperProps={{ strategy: 'fixed' }}
				testId="select-for-testing"
			/>
			<PopupSelect
				{...defaults}
				target={({ isOpen, ...triggerProps }) => (
					<Button isSelected={isOpen} {...triggerProps} testId="button-for-testing-target-two">
						Target2
					</Button>
				)}
				popperProps={{ placement: 'bottom', strategy: 'fixed' }}
				searchThreshold={10}
				testId="triggered-select"
			/>
			<PopupSelect
				{...defaults}
				target={({ isOpen, ...triggerProps }) => (
					<Button isSelected={isOpen} {...triggerProps} testId="button-for-testing-placement">
						Placement: &ldquo;right-start&rdquo; (flip)
					</Button>
				)}
				popperProps={{ placement: 'right-start', strategy: 'fixed' }}
			/>
		</div>
		<div css={flexStyles}>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					background: token('color.background.neutral'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					marginBottom: '1em',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					marginTop: '1em',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: '1em',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					height: 500,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: 300,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					overflowY: 'auto',
				}}
			>
				<h3>Scroll Container</h3>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ height: 100 }} />
				<PopupSelect
					{...defaults}
					target={({ isOpen, ...triggerProps }) => (
						<Button isSelected={isOpen} {...triggerProps}>
							Target3
						</Button>
					)}
					popperProps={{ strategy: 'fixed' }}
				/>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ height: 1000 }} />
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ margin: '1em' }}>
				<PopupSelect
					{...defaults}
					target={({ isOpen, ...triggerProps }) => (
						<IconButton
							icon={AppSwitcherIcon}
							isSelected={isOpen}
							{...triggerProps}
							label="switcher"
						/>
					)}
					popperProps={{ strategy: 'fixed' }}
				/>
			</div>
		</div>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ height: 1000 }} />
	</Fragment>
);

export default PopupSelectExample;
