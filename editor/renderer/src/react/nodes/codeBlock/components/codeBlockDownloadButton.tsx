/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ComponentType, FC } from 'react';
import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import DownloadIcon from '@atlaskit/icon/core/download';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { IconButton } from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';

import { codeBlockButtonMessages } from '@atlaskit/editor-common/messages';

import AnalyticsContext from '../../../../analytics/analyticsContext';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../../../analytics/enums';

type Props = {
	content: string;
	language: string | null;
};

/**
 * NOTE: The language-to-extension mapping logic below is intentionally duplicated in
 * platform/packages/ai-mate/conversation-assistant-utils/src/downloadCodeBlock.ts.
 * This is because @atlaskit/renderer cannot import from @atlassian/conversation-assistant-utils
 * (cross-package dependency not allowed). If you update the logic here, update it there too.
 *
 * Maps ADF code block language names to file extensions.
 * Inlined here to avoid cross-package dependencies on ai-mate packages.
 */
const languageToExtension: Record<string, string> = {
	bash: 'sh',
	c: 'c',
	cpp: 'cpp',
	css: 'css',
	csv: 'csv',
	go: 'go',
	htm: 'html',
	html: 'html',
	java: 'java',
	javascript: 'js',
	js: 'js',
	json: 'json',
	jsx: 'jsx',
	less: 'less',
	markdown: 'md',
	md: 'md',
	python: 'py',
	ruby: 'rb',
	rust: 'rs',
	scss: 'scss',
	sh: 'sh',
	shell: 'sh',
	sql: 'sql',
	ts: 'ts',
	tsx: 'tsx',
	typescript: 'ts',
	xml: 'xml',
	yaml: 'yaml',
	yml: 'yaml',
};

const getFileExtension = (language: string | null): string => {
	if (!language) {
		return 'txt';
	}
	return languageToExtension[language.toLowerCase()] ?? 'txt';
};

const suggestBaseName = (content: string): string => {
	// eslint-disable-next-line require-unicode-regexp
	const filenameCommentPattern = /^(?:#|\/\/|<!--)\s*([\w.\-]+)\s*(?:-->)?$/;
	const firstMeaningfulLine = content.split('\n').find((l) => l.trim()) ?? '';
	const filenameMatch = firstMeaningfulLine.trim().match(filenameCommentPattern);
	if (filenameMatch) {
		// eslint-disable-next-line require-unicode-regexp
		return filenameMatch[1].replace(/\.[^.]+$/, '') || 'rovo-snippet';
	}
	const cleaned = firstMeaningfulLine
		// eslint-disable-next-line require-unicode-regexp
		.replace(/[^a-zA-Z0-9\s]/g, ' ')
		.trim()
		// eslint-disable-next-line require-unicode-regexp
		.replace(/\s+/g, '-')
		.toLowerCase()
		.slice(0, 30);
	return cleaned || 'rovo-snippet';
};

const triggerDownload = (content: string, language: string | null): void => {
	// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
	if (typeof document === 'undefined') {
		return;
	}
	const extension = getFileExtension(language);
	const resolvedFilename = `${suggestBaseName(content)}.${extension}`;
	// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
	const doc = document;
	const blob = new Blob([content], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	const anchor = doc.createElement('a');
	anchor.href = url;
	anchor.download = resolvedFilename;
	anchor.style.display = 'none';
	doc.body.appendChild(anchor);
	anchor.dispatchEvent(new MouseEvent('click', { bubbles: false, cancelable: true, view: window }));
	doc.body.removeChild(anchor);
	// Defer revocation to avoid race condition in Safari/Firefox
	setTimeout(() => URL.revokeObjectURL(url), 0);
};

const DownloadButton = ({ content, language, intl }: Props & WrappedComponentProps) => {
	const tooltip = intl.formatMessage(codeBlockButtonMessages.downloadCodeBlock);

	return (
		<AnalyticsContext.Consumer>
			{({ fireAnalyticsEvent }) => (
				<span>
					<Tooltip content={tooltip} hideTooltipOnClick={false} position="top">
						<div>
							<IconButton
								appearance="subtle"
								label={tooltip}
								icon={DownloadIcon}
								// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
								onClick={(event) => {
									fireAnalyticsEvent({
										// @ts-expect-error - Type 'ACTION.CLICKED' is not assignable to type 'ACTION.CLICKED | ACTION.MEDIA_LINK_TRANSFORMED | ACTION.STARTED | ACTION.TOGGLE_EXPAND | ACTION.UNSUPPORTED_CONTENT_ENCOUNTERED | ACTION.VISITED | ACTION.RENDERED | ACTION.INVALID_PROSEMIRROR_DOCUMENT | ACTION.CRASHED | ... 6 more ... | AnnotationActionType'.
										// This error was introduced after upgrading to TypeScript 5
										action: ACTION.CLICKED,
										actionSubject: ACTION_SUBJECT.BUTTON,
										actionSubjectId: ACTION_SUBJECT_ID.CODEBLOCK_DOWNLOAD,
										eventType: EVENT_TYPE.UI,
									});

									triggerDownload(content, language);

									event.stopPropagation();
								}}
								spacing="compact"
							/>
						</div>
					</Tooltip>
				</span>
			)}
		</AnalyticsContext.Consumer>
	);
};

const _default_1: FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: ComponentType<Props & WrappedComponentProps>;
} = injectIntl(DownloadButton);
export default _default_1;
