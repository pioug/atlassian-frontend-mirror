import React, { useEffect } from 'react';

import { di } from 'react-magnetic-di';

import useAISummaryAction from '../../../../../state/hooks/use-ai-summary-action';

import type { AISummaryActionData } from '../../../../../state/flexible-ui-context/types';
import type { AISummaryActionProps } from './types';
import { CopySummaryAction } from './copy-summary-action';
import { AISummariseAction } from './ai-summarise-action';

export const AISummaryActionComponent = (props: AISummaryActionProps & AISummaryActionData) => {
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
		<CopySummaryAction {...props} testId={testId} content={content} />
	) : (
		<AISummariseAction {...props} testId={testId} summariseUrl={summariseUrl} status={status} />
	);
};
