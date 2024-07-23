/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

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

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const borderStyle = css({
	display: 'inline-flex',
	alignItems: 'flex-start',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > div': {
		border: '1px solid red',
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
		<div>
			<h1>Without display text</h1>
			<p>LinkPicker on left, LoaderFallback on right. These should have similar height</p>
			<BorderWrapper>
				<LinkPicker onSubmit={() => {}} onCancel={() => {}} hideDisplayText={true} />
				<div>
					<LoaderFallback hideDisplayText={true}></LoaderFallback>
				</div>
			</BorderWrapper>
		</div>
	);
};

export const LazyLoadingWithDisplayTextExample = () => {
	return (
		<div>
			<h1>With display text</h1>
			<p>LinkPicker on left, LoaderFallback on right. These should have similar height</p>
			<BorderWrapper>
				<LinkPicker onSubmit={() => {}} onCancel={() => {}} hideDisplayText={false} />
				<div>
					<LoaderFallback hideDisplayText={false} />
				</div>
			</BorderWrapper>
		</div>
	);
};

export const LazyLoadingWithoutDisplayTextWithOnePluginExample = () => {
	return (
		<div>
			<h1>Without display text, with one plugin</h1>
			<p>LinkPicker on left, LoaderFallback on right. These should have similar height</p>
			<BorderWrapper>
				<LinkPicker
					plugins={plugins.slice(0, 1)}
					onSubmit={() => {}}
					onCancel={() => {}}
					hideDisplayText={true}
				/>
				<div>
					<LoaderFallback hideDisplayText={true} plugins={plugins.slice(0, 1)} />
				</div>
			</BorderWrapper>
		</div>
	);
};

export const LazyLoadingWithDisplayTextWithOnePluginExample = () => {
	return (
		<div>
			<h1>With display text, with one plugin</h1>
			<p>LinkPicker on left, LoaderFallback on right. These should have similar height</p>
			<BorderWrapper>
				<LinkPicker plugins={plugins.slice(0, 1)} onSubmit={() => {}} onCancel={() => {}} />
				<div>
					<LoaderFallback plugins={plugins.slice(0, 1)} />
				</div>
			</BorderWrapper>
		</div>
	);
};

export const LazyLoadingWithoutDisplayTextWithPluginsExample = () => {
	return (
		<div>
			<h1>Without display text, with plugins</h1>
			<p>LinkPicker on left, LoaderFallback on right. These should have similar height</p>
			<BorderWrapper>
				<LinkPicker
					plugins={plugins}
					onSubmit={() => {}}
					onCancel={() => {}}
					hideDisplayText={true}
					featureFlags={{ scrollingTabs: true }}
				/>
				<div>
					<LoaderFallback hideDisplayText={true} isLoadingPlugins={true} plugins={plugins} />
				</div>
			</BorderWrapper>
		</div>
	);
};

export const LazyLoadingWithDisplayTextWithPluginsExample = () => {
	return (
		<div>
			<h1>With display text, with plugins</h1>
			<p>LinkPicker on left, LoaderFallback on right. These should have similar height</p>
			<BorderWrapper>
				<LinkPicker
					plugins={plugins}
					onSubmit={() => {}}
					onCancel={() => {}}
					featureFlags={{ scrollingTabs: true }}
				/>
				<div>
					<LoaderFallback isLoadingPlugins={true} plugins={plugins} />
				</div>
			</BorderWrapper>
		</div>
	);
};

export const LazyLoadingEditModeWithDisplayTextWithPluginsExample = () => {
	return (
		<div>
			<h1>Edit mode (mounted with url prop), with display text, with plugins</h1>
			<p>LinkPicker on left, LoaderFallback on right. These should have similar height</p>
			<BorderWrapper>
				<LinkPicker
					plugins={plugins}
					url="https://www.atlassian.com"
					onSubmit={() => {}}
					onCancel={() => {}}
					featureFlags={{ scrollingTabs: true }}
				/>
				<div>
					<LoaderFallback
						url="https://www.atlassian.com"
						isLoadingPlugins={true}
						plugins={plugins}
					/>
				</div>
			</BorderWrapper>
		</div>
	);
};
