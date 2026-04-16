/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css } from '@compiled/react';
import { useIntl } from 'react-intl';

import { jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { messages } from './messages';
import type { ExtensionParams } from './types/extension-handler';
import type { Parameters } from './types/extension-parameters';

// Unknown macro placeholder styling aligned with Legacy Content Macro (LCM) for consistent look
const neutralBorder = token('color.background.neutral');

const unknownMacroContainerStyles = css({
	backgroundColor: token('elevation.surface.raised'),
	border: `1px solid ${neutralBorder}`,
	borderRadius: token('radius.small'),
	overflow: 'hidden',
});

// Match LCM header exactly: lcmHeaderStyles from LegacyContentHeader/index.tsx
const unknownMacroHeaderStyles = css({
	backgroundColor: token('color.background.neutral'),
	paddingTop: token('space.100'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.050'),
	paddingLeft: token('space.200'),
	borderRadius: `${token('radius.small', '4px')} ${token('radius.small', '4px')} 0 0`,
	borderBottom: `${token('border.width')} solid ${neutralBorder}`,
	position: 'relative',
	top: '-1px',
	font: token('font.body.small'),
});

// Match LCM content area: white surface, text color inherits
const unknownMacroBodyStyles = css({
	backgroundColor: token('elevation.surface'),
	margin: 0,
	paddingTop: token('space.150'),
	paddingRight: token('space.150'),
	paddingBottom: token('space.150'),
	paddingLeft: token('space.150'),
});

const unknownMacroPreStyles = css({
	margin: 0,
	whiteSpace: 'pre-wrap',
	wordBreak: 'break-word',
	font: token('font.body'),
	tabSize: 4,
});

interface UnknownMacroPlaceholderProps {
	extensionNode: ExtensionParams<Parameters>;
}

export function UnknownMacroPlaceholder({
	extensionNode,
}: UnknownMacroPlaceholderProps): JSX.Element {
	const intl = useIntl();

	const macroTitle = extensionNode.parameters?.macroMetadata?.title || extensionNode.extensionKey;
	const bodyContent = extensionNode.parameters?.macroParams?.__bodyContent?.value;

	const macroParams = extensionNode.parameters?.macroParams ?? {};
	const formatParam = (key: string, param: { value?: string } | undefined): string => {
		const value = String(param?.value ?? '').trim();
		return `${key} = ${value}`;
	};
	// eslint-disable-next-line @atlassian/perf-linting/no-expensive-computations-in-render -- Ignored via go/ees017 (to be fixed)
	const visibleParams = Object.entries(macroParams)
		.filter(([key]) => !key.startsWith('_'))
		.map(([key, param]) => formatParam(key, param as { value?: string }))
		.join(' | ');

	const headerText = visibleParams
		? `${intl.formatMessage(messages.unknownMacroHeader, { macroTitle })} | ${visibleParams}`
		: intl.formatMessage(messages.unknownMacroHeader, { macroTitle });

	return (
		<section
			css={unknownMacroContainerStyles}
			aria-label={intl.formatMessage(messages.unknownMacroPlaceholderAriaLabel)}
		>
			<div css={unknownMacroHeaderStyles}>{headerText}</div>
			<div css={unknownMacroBodyStyles}>
				<pre css={unknownMacroPreStyles}>{bodyContent}</pre>
			</div>
		</section>
	);
}
