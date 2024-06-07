import React, { useEffect } from 'react';

import { di } from 'react-magnetic-di';

import { useAISummary } from '../../../../../state/hooks/use-ai-summary';

import type { AISummaryActionData } from '../../../../../state/flexible-ui-context/types';
import type { AISummaryActionProps } from './types';
import { CopySummaryAction } from './copy-summary-action';
import { AISummariseAction } from './ai-summarise-action';

export const AISummaryActionComponent = (props: AISummaryActionProps & AISummaryActionData) => {
	di(useAISummary);

	const { url, ari, product, onLoadingChange, testId = 'smart-action-ai-summary-action' } = props;

	const {
		state: { status, content },
		summariseUrl,
	} = useAISummary({ url, ari, product });

	useEffect(() => {
		onLoadingChange?.(status === 'loading');
	}, [onLoadingChange, status]);

	return status === 'done' ? (
		<CopySummaryAction {...props} testId={testId} content={content} />
	) : (
		<AISummariseAction {...props} testId={testId} summariseUrl={summariseUrl} status={status} />
	);
};
