import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import { di } from 'react-magnetic-di';
import { FormattedMessage } from 'react-intl-next';
import { Box, Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import AIIcon from '@atlaskit/icon/core/atlassian-intelligence';
import LegacyAIIcon from '../../../../../common/ai-icon';
import { InfoIcon } from '../icons/info';
import { messages } from '../../../../../../messages';
import useAISummaryAction from '../../../../../../state/hooks/use-ai-summary-action';
import type { AISummaryActionData } from '../../../../../../state/flexible-ui-context/types';

export const AIFooterMetadata = ({ testId, url }: AISummaryActionData & { testId?: string }) => {
	di(useAISummaryAction);

	const {
		state: { status },
	} = useAISummaryAction(url);

	if (status !== 'done') {
		return null;
	}

	return (
		<Inline space="space.100" testId={testId} alignInline="end" grow="fill">
			<Tooltip
				content={<FormattedMessage {...messages.ai_summarized_info_short} />}
				position="bottom"
			>
				{(tooltipProps) => (
					<Box {...tooltipProps}>
						<InfoIcon label="Information" size="small" primaryColor={token('color.icon.subtle')} />
					</Box>
				)}
			</Tooltip>

			<AIIcon
				label="AI"
				LEGACY_size="small"
				LEGACY_fallbackIcon={LegacyAIIcon}
				color={token('color.icon.subtle')}
			/>
		</Inline>
	);
};
