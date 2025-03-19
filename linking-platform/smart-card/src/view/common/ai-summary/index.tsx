/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import Markdown from 'markdown-to-jsx';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import type { AISummaryProps } from './types';
import UList from './ulist';

const AISummaryCSSStyles = css({
	font: token('font.body.UNSAFE_small'),
	wordWrap: 'break-word',
	wordBreak: 'break-word',
	whiteSpace: 'normal',
	WebkitUserSelect: 'text',
	MozUserSelect: 'text',
	MsUserSelect: 'text',
	userSelect: 'text',
});

const baseStyle = css({
	color: token('color.text.subtle'),
	font: token('font.body.small'),
	wordWrap: 'break-word',
	wordBreak: 'break-word',
	whiteSpace: 'normal',
	WebkitUserSelect: 'text',
	MozUserSelect: 'text',
	MsUserSelect: 'text',
	userSelect: 'text',
});

/**
 * A component to render a response from AI in markdown text.
 * @internal
 * @param {AISummaryProps} AISummaryProps
 */
const AISummary = ({
	content = '',
	className,
	testId = 'ai-summary',
	minHeight = 0,
}: AISummaryProps) => {
	if (!content && minHeight === 0) {
		return null;
	}

	return (
		<Markdown
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			css={[
				!fg('platform-linking-visual-refresh-v1') && AISummaryCSSStyles,
				fg('platform-linking-visual-refresh-v1') && baseStyle,
			]}
			children={content}
			options={{
				forceWrapper: true,
				overrides: {
					ul: UList,
				},
			}}
			style={{ minHeight: minHeight }}
		/>
	);
};

export default AISummary;
