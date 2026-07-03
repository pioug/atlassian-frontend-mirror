/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import Markdown from 'markdown-to-jsx';

import { token } from '@atlaskit/tokens';

import type { AISummaryProps } from './types';
import UList from './ulist';

const baseStyle = css({
	font: token('font.body.small'),
	wordWrap: 'break-word',
	wordBreak: 'break-word',
	whiteSpace: 'normal',
	WebkitUserSelect: 'text',
	MozUserSelect: 'text',
	MsUserSelect: 'text',
	userSelect: 'text',
});

const textStyle = css({
	color: token('color.text.subtle'),
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
}: AISummaryProps): JSX.Element | null => {
	if (!content && minHeight === 0) {
		return null;
	}

	return (
		<Markdown
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			css={[baseStyle, textStyle]}
			children={content}
			options={{
				forceWrapper: true,
				overrides: {
					ul: UList,
				},
				disableParsingRawHTML: true,
			}}
			style={{ minHeight: minHeight }}
		/>
	);
};

export default AISummary;
