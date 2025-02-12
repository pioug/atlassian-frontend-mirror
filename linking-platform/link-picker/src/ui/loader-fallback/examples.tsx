/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading';
import { Box, Text } from '@atlaskit/primitives/compiled';

// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { MockLinkPickerPromisePlugin } from '../../__tests__/__helpers/mock-plugins';
import { LINK_PICKER_WIDTH_IN_PX } from '../../common/constants';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { default as LinkPicker } from '../index';

import { LoaderFallback } from './index';

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

const borderStyle = css({
	display: 'inline-flex',
	alignItems: 'flex-start',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > div': {
		borderWidth: '1px',
		borderStyle: 'solid',
		borderColor: 'red',
		marginRight: '5px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${LINK_PICKER_WIDTH_IN_PX}px`,
	},
});

export const BorderWrapper = ({ children }: { children: React.ReactNode }) => (
	<div
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			['--link-picker-width' as string]: `${LINK_PICKER_WIDTH_IN_PX}px`,
		}}
		css={borderStyle}
		data-testid="link-picker-debug-border"
	>
		{children}
	</div>
);

export const LazyLoadingWithoutDisplayTextExample = () => {
	return (
		<Box>
			<Heading size="xlarge">Without display text</Heading>
			<Text as="p">
				LinkPicker on left, LoaderFallback on right. These should have similar height
			</Text>
			<BorderWrapper>
				<LinkPicker onSubmit={() => {}} onCancel={() => {}} hideDisplayText={true} />
				<Box>
					<LoaderFallback hideDisplayText={true}></LoaderFallback>
				</Box>
			</BorderWrapper>
		</Box>
	);
};

export const LazyLoadingWithDisplayTextExample = () => {
	return (
		<Box>
			<Heading size="xlarge">With display text</Heading>
			<Text as="p">
				LinkPicker on left, LoaderFallback on right. These should have similar height
			</Text>
			<BorderWrapper>
				<LinkPicker onSubmit={() => {}} onCancel={() => {}} hideDisplayText={false} />
				<Box>
					<LoaderFallback hideDisplayText={false} />
				</Box>
			</BorderWrapper>
		</Box>
	);
};

export const LazyLoadingWithoutDisplayTextWithOnePluginExample = () => {
	return (
		<Box>
			<Heading size="xlarge">Without display text, with one plugin</Heading>
			<Text as="p">
				LinkPicker on left, LoaderFallback on right. These should have similar height
			</Text>
			<BorderWrapper>
				<LinkPicker
					plugins={plugins.slice(0, 1)}
					onSubmit={() => {}}
					onCancel={() => {}}
					hideDisplayText={true}
				/>
				<Box>
					<LoaderFallback hideDisplayText={true} plugins={plugins.slice(0, 1)} />
				</Box>
			</BorderWrapper>
		</Box>
	);
};

export const LazyLoadingWithDisplayTextWithOnePluginExample = () => {
	return (
		<Box>
			<Heading size="xlarge">With display text, with one plugin</Heading>
			<Text as="p">
				LinkPicker on left, LoaderFallback on right. These should have similar height
			</Text>
			<BorderWrapper>
				<LinkPicker plugins={plugins.slice(0, 1)} onSubmit={() => {}} onCancel={() => {}} />
				<Box>
					<LoaderFallback plugins={plugins.slice(0, 1)} />
				</Box>
			</BorderWrapper>
		</Box>
	);
};

export const LazyLoadingWithoutDisplayTextWithPluginsExample = () => {
	return (
		<Box>
			<Heading size="xlarge">Without display text, with plugins</Heading>
			<Text as="p">
				LinkPicker on left, LoaderFallback on right. These should have similar height
			</Text>
			<BorderWrapper>
				<LinkPicker
					plugins={plugins}
					onSubmit={() => {}}
					onCancel={() => {}}
					hideDisplayText={true}
					featureFlags={{ scrollingTabs: true }}
				/>
				<Box>
					<LoaderFallback hideDisplayText={true} isLoadingPlugins={true} plugins={plugins} />
				</Box>
			</BorderWrapper>
		</Box>
	);
};

export const LazyLoadingWithDisplayTextWithPluginsExample = () => {
	return (
		<Box>
			<Heading size="xlarge">With display text, with plugins</Heading>
			<Text as="p">
				LinkPicker on left, LoaderFallback on right. These should have similar height
			</Text>
			<BorderWrapper>
				<LinkPicker
					plugins={plugins}
					onSubmit={() => {}}
					onCancel={() => {}}
					featureFlags={{ scrollingTabs: true }}
				/>
				<Box>
					<LoaderFallback isLoadingPlugins={true} plugins={plugins} />
				</Box>
			</BorderWrapper>
		</Box>
	);
};

export const LazyLoadingEditModeWithDisplayTextWithPluginsExample = () => {
	return (
		<Box>
			<Heading size="xlarge">
				Edit mode (mounted with url prop), with display text, with plugins
			</Heading>
			<Text as="p">
				LinkPicker on left, LoaderFallback on right. These should have similar height
			</Text>
			<BorderWrapper>
				<LinkPicker
					plugins={plugins}
					url="https://www.atlassian.com"
					onSubmit={() => {}}
					onCancel={() => {}}
					featureFlags={{ scrollingTabs: true }}
				/>
				<Box>
					<LoaderFallback
						url="https://www.atlassian.com"
						isLoadingPlugins={true}
						plugins={plugins}
					/>
				</Box>
			</BorderWrapper>
		</Box>
	);
};
