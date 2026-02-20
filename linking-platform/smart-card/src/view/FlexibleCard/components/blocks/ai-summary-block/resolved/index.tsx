/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useRef } from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';
import { di } from 'react-magnetic-di';

import { RovoIcon } from '@atlaskit/logo';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { SmartLinkDirection } from '../../../../../../constants';
import { messages } from '../../../../../../messages';
import useAISummaryAction from '../../../../../../state/hooks/use-ai-summary-action';
import AISummary from '../../../../../common/ai-summary';
import AIFooter from '../../../../../common/ai-summary/ai-footer';
import MotionWrapper from '../../../common/motion-wrapper';
import Block from '../../block';
import AIEventSummaryViewed from '../ai-event-summary-viewed';
import { EllipsesAnimation } from '../assets/ellipses';
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

const newStyles = cssMap({
	iconWrapper: {
		paddingLeft: token('space.050'),
		paddingRight: token('space.150'),
		display: 'flex',
		alignItems: 'center',
	},
	placeholderWrapper: {
		display: 'flex',
		alignItems: 'center',
	},
	summaryWrapper: {
		paddingTop: token('space.050'),
		display: 'flex',
	},
	ellipsesContainer: {
		paddingLeft: token('space.050'),
	},
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

export const RovoSummaryBlockResolvedView = (props: AISummaryBlockResolvedViewProps) => {
	di(useAISummaryAction, AISummary);

	const { testId, aiSummaryMinHeight = 0, url } = props;

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
		return (
			<Inline xcss={newStyles.placeholderWrapper}>
				<div css={newStyles.iconWrapper}>
					<RovoIcon shouldUseHexLogo={true} size={'xxsmall'} />
				</div>
				<Text size="small" color="color.text">
					<FormattedMessage {...messages.rovo_summary_loading} />
				</Text>
				<Box xcss={newStyles.ellipsesContainer}>
					<EllipsesAnimation isAnimated={true} />
				</Box>
			</Inline>
		);
	}

	return (
		<Block
			{...props}
			direction={SmartLinkDirection.Vertical}
			testId={`${testId}-resolved-view`}
			css={styles}
		>
			<Inline xcss={newStyles.summaryWrapper}>
				<div css={newStyles.iconWrapper}>
					<RovoIcon shouldUseHexLogo={true} size={'xxsmall'} />
				</div>
				{status === 'done' && <AIEventSummaryViewed fromCache={isSummarisedOnMountRef.current} />}
				<MotionWrapper
					minHeight={minHeight}
					show={showAISummary}
					showTransition={!isSummarisedOnMountRef.current}
				>
					<AISummary testId={`${testId}-ai-summary`} minHeight={minHeight} content={content} />
					{status === 'done' && <AIFooter />}
				</MotionWrapper>
			</Inline>
		</Block>
	);
};

export default AISummaryBlockResolvedView;
