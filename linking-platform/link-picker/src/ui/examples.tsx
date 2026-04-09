/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, cssMap, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import {
	MockLinkPickerPromisePlugin,
	UnstableMockLinkPickerPlugin,
} from '../__tests__/__helpers/mock-plugins';

import { default as LinkPicker } from './index';

const styles = cssMap({
	container: {
		marginBlockStart: token('space.600'),
		marginBlockEnd: token('space.600'),
		textAlign: 'center',
	},
	mockImage: {
		borderRadius: token('radius.full'),
		height: '120px',
		width: '120px',
		backgroundColor: token('color.background.information'),
	},
});

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

const createExampleStyle = css({
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: 'red',
	boxSizing: 'border-box',
	display: 'inline-block',
});

const createExample = (props?: Partial<React.ComponentProps<typeof LinkPicker>>) => {
	return (): JSX.Element => (
		<div css={createExampleStyle}>
			<LinkPicker onSubmit={NOOP} {...props} />
		</div>
	);
};

const createWidthExampleStyle = css({
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: 'red',
	boxSizing: 'border-box',
});

const createWidthExample = (props?: Partial<React.ComponentProps<typeof LinkPicker>>) => {
	return (): JSX.Element => (
		<div css={createWidthExampleStyle}>
			<LinkPicker onSubmit={NOOP} onCancel={NOOP} {...props} />
		</div>
	);
};

export const DefaultExample: () => JSX.Element = createExample();
export const WithCancelExample: () => JSX.Element = createExample({
	onCancel: NOOP,
});

export const DisableWidthExample: () => JSX.Element = createWidthExample({
	plugins: undefined,
	disableWidth: true,
});

export const DisableWidthWithPluginsExample: () => JSX.Element = createWidthExample({
	plugins,
	disableWidth: true,
});

export const DisableWidth500Example = (): JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ width: 500 }}>
			<Heading size="xlarge">Width: 500</Heading>
			<Heading size="large">Without plugins</Heading>
			<DisableWidthExample />
		</div>
	);
};

export const DisableWidth500ExampleWithPlugins = (): JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ width: 500 }}>
			<Heading size="xlarge">Width: 500</Heading>
			<Heading size="large">With plugins</Heading>
			<DisableWidthWithPluginsExample />
		</div>
	);
};

export const DisableWidth300Example = (): JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ width: 300 }}>
			<Heading size="xlarge">Width: 300</Heading>
			<Heading size="large">Without plugins</Heading>
			<DisableWidthExample />
		</div>
	);
};

export const DisableWidth300ExampleWithPlugins = (): JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ width: 300 }}>
			<Heading size="xlarge">Width: 300</Heading>
			<Heading size="large">With plugins</Heading>
			<DisableWidthWithPluginsExample />
		</div>
	);
};

export const ZeroPaddingExample: () => JSX.Element = createExample({
	plugins,
	paddingLeft: '0',
	paddingRight: '0',
	paddingBottom: '0',
	paddingTop: '0',
});

export const LargePaddingUsingTokensExample: () => JSX.Element = createExample({
	plugins,
	paddingLeft: token('space.400'),
	paddingRight: token('space.800'),
	paddingTop: token('space.200'),
	paddingBottom: token('space.300'),
});

export const VaryingPaddingsExample: () => JSX.Element = createExample({
	plugins,
	paddingLeft: '5rem',
	paddingRight: '2rem',
	paddingTop: '3rem',
	paddingBottom: '4rem',
});

export const ErrorBoundaryExample: () => JSX.Element = createExample({
	url: 112323 as any, // typecast to trigger an error
});

export const PluginErrorExample: () => JSX.Element = createExample({
	plugins: [
		new UnstableMockLinkPickerPlugin({
			tabKey: 'tab2',
			tabTitle: 'Unstable',
		}),
	],
});

export const UnauthenticatedErrorExample: () => JSX.Element = createExample({
	plugins: [
		new UnstableMockLinkPickerPlugin({
			tabKey: 'tab3',
			tabTitle: 'Unauth',
			errorFallback: (_, __) => null,
		}),
	],
});

export const CustomEmptyStateExample: () => JSX.Element = createExample({
	plugins: [
		{
			resolve: () =>
				Promise.resolve({
					data: [],
				}),
			emptyStateNoResults: () => (
				<Flex xcss={styles.container} direction="column" alignItems="center" gap="space.300">
					<Flex direction="column" alignItems="center" gap="space.200">
						<Flex justifyContent="center">
							<Flex justifyContent="center" alignItems="center" xcss={styles.mockImage}>
								<Text>:)</Text>
							</Flex>
						</Flex>
						<Heading size="medium">Custom empty state</Heading>
						<Text as="p" color="color.text">
							Looks like you're new here
						</Text>
					</Flex>
				</Flex>
			),
		},
	],
});
export const CustomEmptyStateWithAdaptiveHeightExample: () => JSX.Element = createExample({
	adaptiveHeight: true,
	plugins: [
		{
			resolve: () =>
				Promise.resolve({
					data: [],
				}),
			emptyStateNoResults: () => (
				<Flex xcss={styles.container} direction="column" alignItems="center" gap="space.300">
					<Flex direction="column" alignItems="center" gap="space.200">
						<Flex justifyContent="center">
							<Flex justifyContent="center" alignItems="center" xcss={styles.mockImage}>
								<Text>:)</Text>
							</Flex>
						</Flex>
						<Heading size="medium">Custom empty state</Heading>
						<Text as="p" color="color.text">
							Looks like you're new here
						</Text>
					</Flex>
				</Flex>
			),
		},
	],
});

export const VrWithoutEmptyResultsIllustrationExample: () => JSX.Element = createExample({
	shouldRenderNoResultsImage: false,
	adaptiveHeight: true,
	plugins: [
		{
			resolve: () =>
				Promise.resolve({
					data: [],
				}),
		},
	],
});

export const VrWithLimitedRecentSearchesExample: () => JSX.Element = createExample({
	adaptiveHeight: true,
	recentSearchListSize: 3,
	plugins,
});
