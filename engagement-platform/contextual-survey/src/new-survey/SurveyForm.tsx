/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type RefObject, useCallback, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';
import { Transition } from 'react-transition-group';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { cssMap } from '@atlaskit/css';
import Form, { CheckboxField, Field, type OnSubmitHandler } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import Textarea from '@atlaskit/textarea';
import { token } from '@atlaskit/tokens';

import { type FormValues } from '../types';

import FeedbackScoreButtons from './FeedbackScoreButtons';

const transitionBaseStyles = css({
	overflow: 'hidden',
});

const styles = cssMap({
	buttonContainer: {
		marginTop: token('space.300', '24px'),
	},
	questionContainer: {
		marginBottom: token('space.250', '20px'),
	},
});

interface Props {
	onSubmit: OnSubmitHandler<FormValues>;
	question: string;
	scoreSubtext?: Array<string>;
	statement?: string;
	textLabel: string;
}

type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited' | 'unmounted';

const getExpandedHeight = (ref: RefObject<HTMLDivElement>, state: TransitionState): string => {
	if (!ref.current) {
		return '0';
	}

	switch (state) {
		case 'entering':
			return `${ref.current.scrollHeight}px`;
		case 'entered':
			// needed for TextField auto height expand
			return `none`;
		default:
			return '0';
	}
};

const transitionDuration = 200;

export default ({ question, statement, textLabel, scoreSubtext, onSubmit }: Props): JSX.Element => {
	const [expanded, setExpanded] = useState(false);
	const [canContactDefault, setCanContactDefault] = useState(false);
	const hasAutoFilledCanContactRef = useRef(false);

	const expandedAreaRef = useRef<HTMLDivElement>(null);
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
						<Transition in={expanded} timeout={transitionDuration} mountOnEnter>
							{(state: TransitionState) => (
								<div
									css={transitionBaseStyles}
									style={{
										transition: `max-height ${transitionDuration}ms ease-in-out`,
										maxHeight: getExpandedHeight(expandedAreaRef, state),
									}}
									ref={expandedAreaRef}
								>
									<Field<string, HTMLTextAreaElement>
										name="writtenFeedback"
										defaultValue=""
										isDisabled={submitting}
										label={textLabel}
									>
										{({ fieldProps }) => (
											<Textarea
												{...fieldProps}
												aria-label={textLabel}
												onChange={(event) => {
													fieldProps.onChange(event);
													onFeedbackChange();
												}}
											/>
										)}
									</Field>
									<CheckboxField
										name="canContact"
										isDisabled={submitting}
										defaultIsChecked={canContactDefault}
									>
										{({ fieldProps }) => (
											<Checkbox
												{...fieldProps}
												label="Atlassian can contact me about this feedback"
											/>
										)}
									</CheckboxField>
								</div>
							)}
						</Transition>
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
