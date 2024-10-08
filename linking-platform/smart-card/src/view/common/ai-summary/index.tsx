/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import Markdown from 'markdown-to-jsx';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type SerializedStyles, css, jsx } from '@emotion/react';
import UList from './ulist';

const AISummaryCSSStyles = css({
	fontSize: '0.75rem',
	lineHeight: '1rem',
	wordWrap: 'break-word',
	wordBreak: 'break-word',
	whiteSpace: 'normal',
	WebkitUserSelect: 'text',
	MozUserSelect: 'text',
	MsUserSelect: 'text',
	userSelect: 'text',
});

type AISummaryProps = {
	/* Raw markdawn format text to display.*/
	content?: string;
	/* Additional CSS properties */
	overrideCss?: SerializedStyles;
	/**
	 * appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
	/**
	 * Minimum height requirement for the AISummary component to prevent fluctuations in a card size on the summary action.
	 */
	minHeight?: number;
};

/**
 * A component to render a response from AI in markdown text.
 * @internal
 * @param {AISummaryProps} AISummaryProps
 */

const AISummary = ({
	content = '',
	overrideCss,
	testId = 'ai-summary',
	minHeight = 0,
}: AISummaryProps) => {
	if (!content && minHeight === 0) {
		return null;
	}

	return (
		<Markdown
			data-testid={testId}
			css={[AISummaryCSSStyles, overrideCss]}
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
