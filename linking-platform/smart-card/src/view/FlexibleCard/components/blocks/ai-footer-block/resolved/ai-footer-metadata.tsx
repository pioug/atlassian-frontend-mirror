import React from 'react';

import { FormattedMessage } from 'react-intl-next';
import { di } from 'react-magnetic-di';

import AIIcon from '@atlaskit/icon/core/atlassian-intelligence';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { messages } from '../../../../../../messages';
import type { AISummaryActionData } from '../../../../../../state/flexible-ui-context/types';
import useAISummaryAction from '../../../../../../state/hooks/use-ai-summary-action';
import LegacyAIIcon from '../../../../../common/ai-icon';
import { InfoIcon } from '../icons/info';

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
						<InfoIcon label="Information" LEGACY_size="small" color={token('color.icon.subtle')} />
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
