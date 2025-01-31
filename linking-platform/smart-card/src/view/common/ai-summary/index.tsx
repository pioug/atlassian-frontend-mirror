/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import Markdown from 'markdown-to-jsx';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

/**
 * Move this import into this file when cleaning up FF bandicoots-compiled-migration-smartcard
 * Remove the export as well
 */
import AISummaryOld, { type AISummaryProps } from './AISummaryOld';
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
 * A component to render a response from AI in markdown text.
 * @internal
 * @param {AISummaryProps} AISummaryProps
 */
const AISummaryNew = ({
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
			css={[AISummaryCSSStyles]}
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

const AISummary = (props: AISummaryProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <AISummaryNew {...props} />;
	}
	return <AISummaryOld {...props} />;
};

export default AISummary;
