/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, useRef } from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl';
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
import type { AISummaryBlockResolvedViewProps } from './index';

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

const styles: any = css({
	overflow: 'visible',
});

export const RovoSummaryBlockResolvedView = (
	props: AISummaryBlockResolvedViewProps,
): JSX.Element | null => {
	di(useAISummaryAction, AISummary);

	const { testId, aiSummaryMinHeight = 0, placeholder, url } = props;

	const {
		state: { content, status },
	} = useAISummaryAction(url);

	const isSummarisedOnMountRef = useRef(status === 'done');

	const minHeight = isSummarisedOnMountRef.current ? 0 : aiSummaryMinHeight;
	if (status === 'error') {
		return null;
	}

	// Show summary when there is content to display
	if (content && content !== '') {
		return (
			<Block
				{...props}
				direction={SmartLinkDirection.Vertical}
				testId={`${testId}-resolved-view`}
				css={styles}
			>
				<Inline xcss={newStyles.summaryWrapper}>
					<div css={newStyles.iconWrapper}>
						<RovoIcon size="xxsmall" />
					</div>
					{status === 'done' && <AIEventSummaryViewed fromCache={isSummarisedOnMountRef.current} />}
					<MotionWrapper
						minHeight={minHeight}
						show={true}
						showTransition={!isSummarisedOnMountRef.current}
					>
						<AISummary testId={`${testId}-ai-summary`} minHeight={minHeight} content={content} />
						{status === 'done' && <AIFooter />}
					</MotionWrapper>
				</Inline>
			</Block>
		);
	}

	// Show loading state on initial request where content hasn't returned yet.
	if (status === 'loading') {
		return (
			<MotionWrapper minHeight={minHeight} show={true} showTransition={true}>
				<Inline testId={`${testId}-placeholder`} xcss={newStyles.placeholderWrapper}>
					<div css={newStyles.iconWrapper}>
						<RovoIcon size="xxsmall" />
					</div>
					<Text size="small" color="color.text">
						<FormattedMessage {...messages.rovo_summary_loading} />
					</Text>
					<Box xcss={newStyles.ellipsesContainer}>
						<EllipsesAnimation isAnimated={true} />
					</Box>
				</Inline>
			</MotionWrapper>
		);
	}

	// Otherwise, show placeholder if provided
	if (placeholder) {
		return <Fragment>{placeholder}</Fragment>;
	}

	return null;
};
