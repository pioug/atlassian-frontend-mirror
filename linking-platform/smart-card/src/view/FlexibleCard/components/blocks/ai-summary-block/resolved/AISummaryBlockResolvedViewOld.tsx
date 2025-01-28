import React, { useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { di } from 'react-magnetic-di';

import { SmartLinkDirection } from '../../../../../../constants';
import useAISummaryAction from '../../../../../../state/hooks/use-ai-summary-action';
import AISummary from '../../../../../common/ai-summary';
import MotionWrapper from '../../../common/motion-wrapper';
import Block from '../../block';
import AIEventSummaryViewed from '../ai-event-summary-viewed';
import type { AISummaryBlockProps } from '../types';

type AISummaryBlockResolvedViewProps = AISummaryBlockProps & {
	/**
	 * URL to be summarised
	 */
	url: string;
};

const AISummaryBlockResolvedViewOld = (props: AISummaryBlockResolvedViewProps) => {
	di(useAISummaryAction, AISummary);

	const { testId, aiSummaryMinHeight = 0, placeholder, url } = props;

	const {
		state: { content, status },
	} = useAISummaryAction(url);

	const showAISummary =
		status === 'done' ||
		// We want to display the AI Summary component only when there is content available during the loading process.
		(status === 'loading' && !!content);

	const isSummarisedOnMountRef = useRef(status === 'done');

	const minHeight = isSummarisedOnMountRef.current ? 0 : aiSummaryMinHeight;

	if (!showAISummary) {
		return <>{placeholder}</>;
	}

	return (
		<Block
			{...props}
			direction={SmartLinkDirection.Vertical}
			testId={`${testId}-resolved-view`}
			/**
			 * Enabled for feature discovery to allow box shadow to overflow
			 * Cleanup: https://product-fabric.atlassian.net/browse/EDM-8681
			 */
			overrideCss={css(
				{
					overflow: 'visible',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				props.overrideCss,
			)}
		>
			{status === 'done' && <AIEventSummaryViewed fromCache={isSummarisedOnMountRef.current} />}
			<MotionWrapper
				minHeight={minHeight}
				show={showAISummary}
				showTransition={!isSummarisedOnMountRef.current}
			>
				<AISummary testId={`${testId}-ai-summary`} minHeight={minHeight} content={content} />
			</MotionWrapper>
		</Block>
	);
};

export default AISummaryBlockResolvedViewOld;
