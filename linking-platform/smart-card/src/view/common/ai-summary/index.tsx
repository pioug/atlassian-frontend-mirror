/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import Markdown from 'markdown-to-jsx';

import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
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

const textStyleNew = css({
	color: token('color.text'),
});

const textStyleOld = css({
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

	const is3pExperimentEnabled =
		// eslint-disable-next-line @atlaskit/platform/no-preconditioning
		(fg('platform_sl_3p_auth_rovo_action_kill_switch') &&
			expValEqualsNoExposure('platform_sl_3p_auth_rovo_action', 'isEnabled', true)) ||
		// eslint-disable-next-line @atlaskit/platform/no-preconditioning
		(fg('rovogrowth-640-inline-action-nudge-fg') &&
			expValEqualsNoExposure('rovogrowth-640-inline-action-nudge-exp', 'isEnabled', true));
	return (
		<Markdown
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			css={[baseStyle, is3pExperimentEnabled ? textStyleNew : textStyleOld]}
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
