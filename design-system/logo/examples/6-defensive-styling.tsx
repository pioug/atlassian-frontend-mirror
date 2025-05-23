/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { ConfluenceIcon, JiraIcon } from '@atlaskit/logo';
import { token } from '@atlaskit/tokens';

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
		<hr role="presentation" />
		<div data-testid="defensive-styling">
			<div css={inlineStyles}>
				<ConfluenceIcon size="xxsmall" appearance="brand" />
				<span>Confluence</span>
			</div>
			<div css={inlineStyles}>
				<JiraIcon size="xxsmall" appearance="brand" />
				<span>Jira</span>
			</div>
		</div>
	</div>
);
