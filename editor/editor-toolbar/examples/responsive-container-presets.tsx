/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { FullToolbarWithPreset } from './toolbar/examples/FullToolbarWithPreset';

const wrapperStyles = css({
	maxWidth: '1560px',
	marginTop: token('space.400'),
	marginLeft: 'auto',
	marginRight: 'auto',
	paddingLeft: token('space.400'),
	paddingRight: token('space.400'),
});

const containerStyles = css({
	marginBottom: token('space.200'),
	paddingTop: token('space.200'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
	border: `2px solid ${token('color.border')}`,
});

const headingStyles = css({
	marginBottom: token('space.100'),
	fontWeight: token('font.weight.semibold'),
});

const toolbarWrapperStyles = css({
	resize: 'horizontal',
	overflow: 'auto',
	minWidth: '200px',
	maxWidth: '100%',
	border: `1px dashed ${token('color.border.accent.blue')}`,
	paddingTop: token('space.100'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
});

/**
 * Example demonstrating the different breakpoint presets available in ResponsiveContainer.
 * Each preset is optimized for different use cases with specific breakpoint values.
 */
export default function ResponsiveContainerPresetsExample() {
	return (
		<div css={wrapperStyles}>
			<h1>ResponsiveContainer Breakpoint Presets</h1>
			<p>
				Resize the containers below to see how different presets respond at different widths. Each
				container has a dashed blue border and can be resized horizontally.
			</p>

			<div css={containerStyles}>
				<h2 css={headingStyles}>Fullpage Preset (410, 476, 768, 1024)</h2>
				<p>Used for editor full-page experiences</p>
				<div css={toolbarWrapperStyles}>
					<FullToolbarWithPreset breakpointPreset="fullpage" />
				</div>
			</div>

			<div css={containerStyles}>
				<h2 css={headingStyles}>Reduced Preset (210, 408, 575, 1024)</h2>
				<p>Used for default compact toolbars and constrained layouts</p>
				<div css={toolbarWrapperStyles}>
					<FullToolbarWithPreset breakpointPreset="reduced" />
				</div>
			</div>

			<div css={containerStyles}>
				<h2 css={headingStyles}>Jira Issue Preset (210, 408, 575, 1024)</h2>
				<p>Used for Jira issue view and similar contexts</p>
				<div css={toolbarWrapperStyles}>
					<FullToolbarWithPreset breakpointPreset="jira-issue" />
				</div>
			</div>

			<div css={containerStyles}>
				<h2 css={headingStyles}>JSM Comment Preset (210, 408, 550, 1024)</h2>
				<p>Used for JSM comment editor with canned responses button</p>
				<div css={toolbarWrapperStyles}>
					<FullToolbarWithPreset breakpointPreset="jsm-comment" />
				</div>
			</div>

			<div css={containerStyles}>
				<h2 css={headingStyles}>Confluence Comment Preset (210, 408, 648, 1024)</h2>
				<p>Used for Confluence comment editor and inline contexts</p>
				<div css={toolbarWrapperStyles}>
					<FullToolbarWithPreset breakpointPreset="confluence-comment" />
				</div>
			</div>

	
		</div>
	);
}
