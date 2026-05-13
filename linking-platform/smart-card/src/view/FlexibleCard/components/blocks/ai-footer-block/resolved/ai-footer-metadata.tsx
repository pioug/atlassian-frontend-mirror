import React from 'react';

import { FormattedMessage } from 'react-intl';
import { di } from 'react-magnetic-di';

import RovoIcon from '@atlaskit/icon-lab/core/rovo';
import AIIcon from '@atlaskit/icon/core/atlassian-intelligence';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { messages } from '../../../../../../messages';
import type { AISummaryActionData } from '../../../../../../state/flexible-ui-context/types';
import useAISummaryAction from '../../../../../../state/hooks/use-ai-summary-action';
import { InfoIcon } from '../icons/info';

export const AIFooterMetadata = ({
	testId,
	url,
}: AISummaryActionData & { testId?: string }): React.JSX.Element | null => {
	di(useAISummaryAction);

	const {
		state: { status },
	} = useAISummaryAction(url);

	if (status !== 'done') {
		return null;
	}

	const Icon = fg('platform_sl_ai_summary_rebrand') ? RovoIcon : AIIcon;

	return (
		<Inline space="space.100" testId={testId} alignInline="end" grow="fill">
			<Tooltip
				content={<FormattedMessage {...messages.ai_summarized_info_short} />}
				position="bottom"
			>
				{(tooltipProps) => (
					<Box {...tooltipProps}>
						<InfoIcon label="Information" color={token('color.icon.subtle')} />
					</Box>
				)}
			</Tooltip>

			<Icon label="AI" color={token('color.icon.subtle')} />
		</Inline>
	);
};
