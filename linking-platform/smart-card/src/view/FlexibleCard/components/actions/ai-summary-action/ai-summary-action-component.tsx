import React, { useEffect } from 'react';

import { di } from 'react-magnetic-di';

import { fg } from '@atlaskit/platform-feature-flags';

import type { AISummaryActionData } from '../../../../../state/flexible-ui-context/types';
import useAISummaryAction from '../../../../../state/hooks/use-ai-summary-action';

import { AISummariseAction } from './ai-summarise-action';
import { CopySummaryAction, CopySummaryActionNew } from './copy-summary-action';
import type { AISummaryActionProps } from './types';

export const AISummaryActionComponent = (
	props: AISummaryActionProps & AISummaryActionData,
): React.JSX.Element => {
	di(useAISummaryAction);

	const { url, onLoadingChange, testId = 'smart-action-ai-summary-action' } = props;

	const {
		state: { status, content },
		summariseUrl,
	} = useAISummaryAction(url);

	useEffect(() => {
		onLoadingChange?.(status === 'loading');
	}, [onLoadingChange, status]);

	return status === 'done' ? (
		fg('platform_sl_3p_auth_rovo_action_kill_switch') ? (
			<CopySummaryActionNew {...props} summary={content} testId={testId} />
		) : (
			<CopySummaryAction {...props} testId={testId} content={content} />
		)
	) : (
		<AISummariseAction {...props} testId={testId} summariseUrl={summariseUrl} status={status} />
	);
};
