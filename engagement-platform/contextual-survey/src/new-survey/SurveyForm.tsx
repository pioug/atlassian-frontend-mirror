/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Form, { Field, type OnSubmitHandler } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { useResizingHeight } from '@atlaskit/motion';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type FormValues } from '../types';

import FeedbackScoreButtons from './FeedbackScoreButtons';
import { SurveyFormExpandedFeedback } from './SurveyFormExpandedFeedback';

const transitionBaseStyles = css({
	overflow: 'hidden',
});

const styles = cssMap({
	buttonContainer: {
		marginTop: token('space.300'),
	},
	questionContainer: {
		marginBottom: token('space.250'),
	},
});

interface Props {
	onSubmit: OnSubmitHandler<FormValues>;
	question: string;
	scoreSubtext?: Array<string>;
	statement?: string;
	textLabel: string;
}

const TRANSITION_DURATION = 200;

export default ({
	question,
	statement,
	textLabel,
	scoreSubtext,
	onSubmit,
}: Props): React.JSX.Element => {
	const [expanded, setExpanded] = useState(false);
	const [canContactDefault, setCanContactDefault] = useState(false);
	const hasAutoFilledCanContactRef = useRef(false);

	const onScoreSelect = useCallback(() => {
		setExpanded(true);
	}, [setExpanded]);

	// On the first type the user types some feedback we auto select
	// the option for allowing feedback. This automatic selection only
	// happens once. After that it is up to the user to control
	const onFeedbackChange = useCallback(() => {
		if (hasAutoFilledCanContactRef.current) {
			return;
		}
		hasAutoFilledCanContactRef.current = true;
		setCanContactDefault(true);
	}, []);

	const resizingHeightProps = useResizingHeight({
		duration: () => TRANSITION_DURATION,
		timingFunction: () => 'ease-in-out',
	});

	return (
		<section aria-labelledby="contextualSurveyQuestion">
			<Stack space="space.150" xcss={styles.questionContainer}>
				{statement && (
					<Text as="p" id="contextualSurveyStatement" size="medium">
						{statement}
					</Text>
				)}
				{/* The as='h2' is required to override it being an h5 by default, addressing accessibility issues */}
				<Heading id="contextualSurveyQuestion" size="small" as="h2">
					{question}
				</Heading>
			</Stack>
			<Form onSubmit={onSubmit}>
				{({ formProps, submitting }) => (
					<form {...formProps}>
						<Field<number> name="feedbackScore" isDisabled={submitting} isRequired>
							{({ fieldProps }) => (
								<FeedbackScoreButtons
									scoreSubtext={scoreSubtext}
									{...fieldProps}
									onChange={(score) => {
										fieldProps.onChange(score);
										onScoreSelect();
									}}
								/>
							)}
						</Field>
						<div {...resizingHeightProps} css={transitionBaseStyles}>
							{expanded ? (
								<SurveyFormExpandedFeedback
									canContactDefault={canContactDefault}
									onFeedbackChange={onFeedbackChange}
									submitting={submitting}
									textLabel={textLabel}
								/>
							) : null}
						</div>
						<Box xcss={styles.buttonContainer}>
							<Button
								isDisabled={!expanded}
								type="submit"
								appearance="primary"
								isLoading={submitting}
								shouldFitContainer
							>
								Submit
							</Button>
						</Box>
					</form>
				)}
			</Form>
		</section>
	);
};
