/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import EditorPanelIcon from '@atlaskit/icon/utility/migration/information--editor-panel';
import Lozenge from '@atlaskit/lozenge';
import { token } from '@atlaskit/tokens';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import { fg } from '@atlaskit/platform-feature-flags';

import { messages } from '../../../../../../messages';
import AIIcon from '../../../../../common/ai-icon';
import AIIndicatorTooltip from './ai-indicator-tooltip';
import AIIndicatorContainer from './ai-indicator-container';
import AILearnMoreAnchor from '../../../common/ai-summary/ai-learn-more-anchor';
import type { AIStateIndicatorProps } from './types';

const tooltipMsgStyles = xcss({
	color: 'color.text',
	fontSize: '14px',
	fontWeight: '400',
	lineHeight: '20px',
});

const iconTooltipLinkStyles = css({
	color: token('color.text.subtlest', '#626F86'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:link, :visited': {
		color: token('color.text.subtlest', '#626F86'),
	},
	'&:hover': {
		color: token('color.text.subtle', '#44546F'),
	},
	'&:active': {
		color: token('color.text', '#172B4D'),
	},
	textDecoration: 'underline',
});

const iconTooltipTitleStyles = xcss({
	color: 'color.text',
	fontSize: '12px',
	fontWeight: '400',
	lineHeight: '16px',
});

const iconTooltipDescStyles = xcss({
	color: 'color.text.subtlest',
	fontSize: '11px',
	fontWeight: '400',
	lineHeight: '14px',
});

const iconTooltipTriggerStyles = xcss({
	verticalAlign: 'bottom',
});

const AIStateDone = ({ appearance, testId }: Partial<AIStateIndicatorProps>) => {
	const icon = <AIIcon label="AI" size="small" testId={`${testId}-done-icon`} />;

	const title = fg(
		'platform.linking-platform.smart-card.hover-card-ai-summaries-release-stable',
	) ? (
		<Box testId={`${testId}-done-message`}>
			<FormattedMessage {...messages.ai_summarized} />
		</Box>
	) : (
		<React.Fragment>
			<Box testId={`${testId}-done-message`}>
				<FormattedMessage {...messages.ai_summarized_abbreviation} />
			</Box>
			<Box>
				<Lozenge appearance="new" testId={`${testId}-beta`}>
					<FormattedMessage {...messages.beta} />
				</Lozenge>
			</Box>
		</React.Fragment>
	);

	switch (appearance) {
		case 'icon-only':
			return (
				<AIIndicatorTooltip
					content={
						<Inline alignBlock="center" space="space.100">
							<AIIcon label="AI" size="medium" testId={`${testId}-done-tooltip-icon`} />
							<Stack>
								<Inline
									alignBlock="center"
									alignInline="start"
									space="space.050"
									xcss={iconTooltipTitleStyles}
								>
									{title}
								</Inline>
								<Box xcss={iconTooltipDescStyles}>
									<FormattedMessage
										{...messages.ai_summarized_info}
										values={{
											a: (chunks: React.ReactNode[]) => (
												<AILearnMoreAnchor css={iconTooltipLinkStyles}>{chunks}</AILearnMoreAnchor>
											),
										}}
									/>
								</Box>
							</Stack>
						</Inline>
					}
					trigger={icon}
					xcss={iconTooltipTriggerStyles}
				/>
			);
		default:
			return (
				<AIIndicatorContainer
					icon={icon}
					content={
						<Inline alignBlock="center" alignInline="start" space="space.050">
							{title}
							<AIIndicatorTooltip
								content={
									<Box xcss={tooltipMsgStyles} testId={`${testId}-done-tooltip`}>
										<FormattedMessage
											{...messages.ai_summarized_info}
											values={{
												a: (chunks: React.ReactNode[]) => (
													<AILearnMoreAnchor>{chunks}</AILearnMoreAnchor>
												),
											}}
										/>
									</Box>
								}
								trigger={
									<EditorPanelIcon
										label="Info"
										LEGACY_size="small"
										testId={`${testId}-done-info`}
									/>
								}
							/>
						</Inline>
					}
					testId={`${testId}-done`}
				/>
			);
	}
};

export default AIStateDone;
