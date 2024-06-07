import React from 'react';

import { token } from '@atlaskit/tokens';

import { MockLinkPickerPromisePlugin } from '../__tests__/__helpers/mock-plugins';

import { default as LinkPicker } from './index';

const NOOP = () => {};

const plugins = [
	new MockLinkPickerPromisePlugin({
		tabKey: 'confluence',
		tabTitle: 'Confluence',
	}),
	new MockLinkPickerPromisePlugin({
		tabKey: 'jira',
		tabTitle: 'Jira',
	}),
];

const createExample = (props?: Partial<React.ComponentProps<typeof LinkPicker>>) => {
	return () => (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				border: '1px solid red',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				boxSizing: 'border-box',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				display: 'inline-block',
			}}
		>
			<LinkPicker onSubmit={NOOP} {...props} />
		</div>
	);
};

const createWidthExample = (props?: Partial<React.ComponentProps<typeof LinkPicker>>) => {
	return () => (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				border: '1px solid red',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				boxSizing: 'border-box',
			}}
		>
			<LinkPicker onSubmit={NOOP} onCancel={NOOP} {...props} />
		</div>
	);
};

export const DefaultExample = createExample();
export const WithCancelExample = createExample({
	onCancel: NOOP,
});

export const DisableWidthExample = createWidthExample({
	plugins: undefined,
	disableWidth: true,
});

export const DisableWidthWithPluginsExample = createWidthExample({
	plugins,
	disableWidth: true,
});

export const DisableWidth500Example = () => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ width: 500 }}>
			<h1>Width: 500</h1>
			<h2>Without plugins</h2>
			<DisableWidthExample />
			<h2>With plugins</h2>
			<DisableWidthWithPluginsExample />
		</div>
	);
};

export const DisableWidth300Example = () => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ width: 300 }}>
			<h1>Width: 300</h1>
			<h2>Without plugins</h2>
			<DisableWidthExample />
			<h2>With plugins</h2>
			<DisableWidthWithPluginsExample />
		</div>
	);
};

export const ZeroPaddingExample = createExample({
	plugins,
	paddingLeft: '0',
	paddingRight: '0',
	paddingBottom: '0',
	paddingTop: '0',
});

export const LargePaddingUsingTokensExample = createExample({
	plugins,
	paddingLeft: token('space.400', '24px'),
	paddingRight: token('space.800', '48px'),
	paddingTop: token('space.200', '12px'),
	paddingBottom: token('space.300', '18px'),
});

export const VaryingPaddingsExample = createExample({
	plugins,
	paddingLeft: '5rem',
	paddingRight: '2rem',
	paddingTop: '3rem',
	paddingBottom: '4rem',
});

export const ErrorBoundaryExample = createExample({
	url: 112323 as any, // typecast to trigger an error
});
