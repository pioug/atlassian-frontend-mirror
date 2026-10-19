/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { createPortal } from 'react-dom';

import { FormattedMessage } from 'react-intl';

import { cssMap, jsx } from '@atlaskit/css';
import { messages } from '@atlaskit/media-ui/messages';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		// Same as the player's time and speed text in the footer: the inherited font and color.text.
		color: token('color.text'),
	},
	language: {
		paddingTop: token('space.025'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.025'),
		paddingLeft: token('space.100'),
		borderRadius: token('radius.small'),
		backgroundColor: token('color.background.neutral'),
	},
});

type CodeViewerFooterProps = {
	// The number of lines in the file, if the renderer knows it.
	lineCount?: number;
	// The name of the language the file is highlighted with, if any.
	languageName: string | undefined;
	footerElement: HTMLElement | null | undefined;
};

// The line count on the left, if there is one, and the language on the right, in the inset media footer.
export const CodeViewerFooter = ({
	lineCount,
	languageName,
	footerElement,
}: CodeViewerFooterProps): JSX.Element | null => {
	if (!footerElement) {
		return null;
	}

	return createPortal(
		<div css={styles.root} data-testid="media-viewer-code-footer">
			<span>
				{lineCount !== undefined && (
					<FormattedMessage {...messages.line_count} values={{ count: lineCount }} />
				)}
			</span>
			<span css={styles.language} data-testid="media-viewer-code-footer-language">
				{languageName ?? <FormattedMessage {...messages.plain_text} />}
			</span>
		</div>,
		footerElement,
	);
};
