/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useRef } from 'react';

import { css, jsx } from '@compiled/react';
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

const styles = css({
	overflow: 'visible',
});

const AISummaryBlockResolvedView = (props: AISummaryBlockResolvedViewProps) => {
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
		return <Fragment>{placeholder}</Fragment>;
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
			css={styles}
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

export default AISummaryBlockResolvedView;
