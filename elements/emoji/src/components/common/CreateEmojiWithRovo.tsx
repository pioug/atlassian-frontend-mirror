/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ChangeEvent, useCallback, useContext, useState } from 'react';

import { css, jsx } from '@compiled/react';
import { FormattedMessage, useIntl } from 'react-intl';

import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';
import IconButton from '@atlaskit/button/icon/button';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';
import { RovoIcon } from '@atlaskit/logo/rovo/icon';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Text } from '@atlaskit/primitives/compiled/text';
import TextField from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

import { generateEmojiImage } from '../../api/ai/generateEmojiImage';
import { EmojiContext } from '../../context/EmojiContext';
import { checkEmojiAICreditStatus } from '../../credit-check';
import { slugifyPrompt } from '../../util/ai-emoji';
import { aiGenerationCompletedEvent } from '../../util/analytics/aiGenerationCompletedEvent';
import { aiGenerationFailedEvent } from '../../util/analytics/aiGenerationFailedEvent';
import { aiGenerationStartedEvent } from '../../util/analytics/aiGenerationStartedEvent';
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

// No divider above the section, and an 8px gap before the emoji name field (2px plus the
// upload row's 6px gap).
// When cleaning up platform_emoji_search_top, merge this into sectionStyles: remove marginTop and
// borderTop there and add marginBottom.
const sectionSpacingStyles = css({
	marginTop: token('space.0'),
	marginBottom: token('space.025'),
	borderTop: 'none',
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
	const getAICreditStatus = useContext(EmojiContext)?.emoji.getAICreditStatus;
	const creditStatus = checkEmojiAICreditStatus(getAICreditStatus);
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
		if (!trimmedPrompt || isGenerating || checkEmojiAICreditStatus(getAICreditStatus).isBlocked) {
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
	}, [contentId, fireAnalytics, isGenerating, onEmojiGenerated, prompt, getAICreditStatus]);

	const generateDisabled = !prompt.trim() || isGenerating;
	const isSearchOnTop =
		fg('platform_emoji_search_top') || isExperimentEnabled('platform_editor_slash_command');

	return (
		<div
			css={[sectionStyles, isSearchOnTop && sectionSpacingStyles]}
			data-testid={createEmojiWithRovoTestId}
		>
			<div css={headerStyles}>
				<RovoIcon
					appearance="brand"
					size={isSearchOnTop ? 'xxsmall' : 'xsmall'}
					label={formatMessage(messages.createEmojiWithRovoTitle)}
				/>
				<Text size="medium" weight="bold">
					<FormattedMessage {...messages.createEmojiWithRovoTitle} />
				</Text>
			</div>

			{creditStatus.isBlocked ? (
				<div role="status">{creditStatus.renderCustomContent()}</div>
			) : (
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
			)}

			{!creditStatus.isBlocked && hasError && (
				<EmojiErrorMessage
					errorStyle="chooseFile"
					message={<FormattedMessage {...messages.createEmojiWithRovoError} />}
				/>
			)}
		</div>
	);
};

export default CreateEmojiWithRovo;
