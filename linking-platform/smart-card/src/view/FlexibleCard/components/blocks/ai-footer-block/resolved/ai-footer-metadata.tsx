import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import { di } from 'react-magnetic-di';
import { FormattedMessage } from 'react-intl-next';
import { Box, Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import AIIcon from '../../../../../common/ai-icon';
import { InfoIcon } from '../icons/info';
import { messages } from '../../../../../../messages';
import { useAISummary } from '../../../../../../state/hooks/use-ai-summary';

import type { AISummaryActionData } from '../../../../../../state/flexible-ui-context/types';

export const AIFooterMetadata = ({
	testId,
	url,
	ari,
	product,
}: AISummaryActionData & { testId?: string }) => {
	di(useAISummary);

	const {
		state: { status },
	} = useAISummary({ url, ari, product });

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

			<AIIcon label="AI" size="small" primaryColor={token('color.icon.subtle')} />
		</Inline>
	);
};
