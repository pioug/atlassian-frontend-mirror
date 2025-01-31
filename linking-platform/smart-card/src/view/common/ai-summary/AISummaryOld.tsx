/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';
import Markdown from 'markdown-to-jsx';

import { token } from '@atlaskit/tokens';

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

/**
 * Move this type to the index file upon FF cleanup. bandicoots-compiled-migration-smartcard
 * Remove the export as well.
 */
export type AISummaryProps = {
	/* Raw markdown format text to display.*/
	content?: string;
	/**
	 * Additional CSS properties
	 * @deprecated remove on FF cleanup bandicoots-compiled-migration-smartcard
	 * Use compiled css instead
	 */
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
	/**
	 * For compiled css
	 */
	className?: string;
};

/**
 * A component to render a response from AI in markdown text.
 * @internal
 * @param {AISummaryProps} AISummaryProps
 */

const AISummaryOld = ({
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

export default AISummaryOld;
