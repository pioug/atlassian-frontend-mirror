/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ChangeEvent, useCallback, useState } from 'react';
import { css, jsx } from '@compiled/react';
import { FormattedMessage, useIntl } from 'react-intl';
import { token } from '@atlaskit/tokens';
import { IconButton } from '@atlaskit/button/new';
import TextField from '@atlaskit/textfield';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';
import { RovoIcon } from '@atlaskit/logo';
import { Text } from '@atlaskit/primitives/compiled';

import type { AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { generateEmojiImage } from '../../api/ai/generateEmojiImage';
import { slugifyPrompt } from '../../util/ai-emoji';
import {
	aiGenerationStartedEvent,
	aiGenerationCompletedEvent,
	aiGenerationFailedEvent,
} from '../../util/analytics';
import { messages } from '../i18n';
import EmojiErrorMessage from './EmojiErrorMessage';

export const createEmojiWithRovoTestId = 'create-emoji-with-rovo';
export const createEmojiWithRovoPromptTestId = 'create-emoji-with-rovo-prompt';
export const createEmojiWithRovoGenerateTestId = 'create-emoji-with-rovo-generate';

const sectionStyles = css({
	display: 'flex',
	flexDirection: 'column',
	gap: token('space.100'),
	paddingTop: token('space.150'),
	marginTop: token('space.100'),
	borderTop: `${token('border.width')} solid ${token('color.border')}`,
});

const headerStyles = css({
	display: 'flex',
	alignItems: 'center',
	gap: token('space.075'),
});

const promptRowStyles = css({
	display: 'flex',
	alignItems: 'flex-start',
	gap: token('space.100'),
});

const promptInputStyles = css({
	flex: 1,
});

export interface CreateEmojiWithRovoProps {
	/**
	 * The current Confluence page content id. Required by the image generation
	 * backend. When absent, the section should not be rendered by the caller.
	 */
	contentId: string;
	/**
	 * Fires an analytics event in the elements channel.
	 */
	fireAnalytics?: (event: AnalyticsEventPayload) => void;
	/**
	 * Called when an emoji image has been generated. The generated image (as a
	 * data URL) and a suggested slug name are handed back to the parent upload
	 * form, which then drives the shared preview, name field and "Add emoji"
	 * button — so there is a single name input and a single submit button.
	 */
	onEmojiGenerated: (dataURL: string, suggestedName: string) => void;
}

const CreateEmojiWithRovo = (props: CreateEmojiWithRovoProps): JSX.Element => {
	const { contentId, fireAnalytics, onEmojiGenerated } = props;
	const { formatMessage } = useIntl();

	const [prompt, setPrompt] = useState('');
	const [isGenerating, setIsGenerating] = useState(false);
	const [hasError, setHasError] = useState(false);

	const onPromptChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setPrompt(event.target.value);
		// Clear any previous error as soon as the user edits the prompt to retry.
		setHasError(false);
	}, []);

	const onGenerate = useCallback(async () => {
		const trimmedPrompt = prompt.trim();
		if (!trimmedPrompt || isGenerating) {
			return;
		}

		setHasError(false);
		setIsGenerating(true);
		fireAnalytics?.(aiGenerationStartedEvent({ promptLength: trimmedPrompt.length }));
		const startTime = Date.now();

		try {
			const { imageData } = await generateEmojiImage({
				contentId,
				prompt: trimmedPrompt,
			});

			const dataURL = `data:image/png;base64,${imageData}`;
			const suggestedName = slugifyPrompt(trimmedPrompt);
			fireAnalytics?.(aiGenerationCompletedEvent({ duration: Date.now() - startTime }));
			// Hand the generated image to the parent upload form.
			onEmojiGenerated(dataURL, suggestedName);
		} catch (error) {
			setHasError(true);
			fireAnalytics?.(
				aiGenerationFailedEvent({
					errorType: error instanceof Error ? error.message : 'generation_failed',
				}),
			);
		} finally {
			setIsGenerating(false);
		}
	}, [contentId, fireAnalytics, isGenerating, onEmojiGenerated, prompt]);

	const generateDisabled = !prompt.trim() || isGenerating;

	return (
		<div css={sectionStyles} data-testid={createEmojiWithRovoTestId}>
			<div css={headerStyles}>
				<RovoIcon
					appearance="brand"
					size="xsmall"
					label={formatMessage(messages.createEmojiWithRovoTitle)}
				/>
				<Text size="medium" weight="bold">
					<FormattedMessage {...messages.createEmojiWithRovoTitle} />
				</Text>
			</div>

			<div css={promptRowStyles}>
				<span css={promptInputStyles}>
					<TextField
						value={prompt}
						onChange={onPromptChange}
						placeholder={formatMessage(messages.createEmojiWithRovoPromptPlaceholder)}
						aria-label={formatMessage(messages.createEmojiWithRovoPromptAriaLabel)}
						isCompact
						isDisabled={isGenerating}
						testId={createEmojiWithRovoPromptTestId}
					/>
				</span>
				<IconButton
					appearance="primary"
					icon={ArrowUpIcon}
					label={formatMessage(messages.createEmojiWithRovoGenerateLabel)}
					isDisabled={generateDisabled}
					isLoading={isGenerating}
					onClick={onGenerate}
					testId={createEmojiWithRovoGenerateTestId}
				/>
			</div>

			{hasError && (
				<EmojiErrorMessage
					errorStyle="chooseFile"
					message={<FormattedMessage {...messages.createEmojiWithRovoError} />}
				/>
			)}
		</div>
	);
};

export default CreateEmojiWithRovo;
