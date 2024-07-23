/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { ConfluenceIcon, JiraIcon } from '../src';

/**
 * Example of properties that may be set on an ancestor,
 * that can then be inherited by the logo and break its layout.
 */
const ancestorStyles = css({
	lineHeight: '24px',
	whiteSpace: 'pre-wrap',
});

const inlineStyles = css({
	display: 'flex',
	alignItems: 'center',
	gap: token('space.050', '4px'),
});

export default () => (
	<div css={ancestorStyles}>
		<p>Logo should be resilient against inherited styles.</p>
		<hr />
		<div data-testid="defensive-styling">
			<div css={inlineStyles}>
				<ConfluenceIcon size="xsmall" appearance="brand" />
				<span>Confluence</span>
			</div>
			<div css={inlineStyles}>
				<JiraIcon size="xsmall" appearance="brand" />
				<span>Jira</span>
			</div>
		</div>
	</div>
);
