/** @jsx jsx */
import { type RefObject, useCallback, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { Transition } from 'react-transition-group';

import { LoadingButton as Button } from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { CheckboxField, Field, FormFooter, type OnSubmitHandler } from '@atlaskit/form';
import Textarea from '@atlaskit/textarea';
import { fontSize } from '@atlaskit/theme/constants';

import { type FormValues } from '../types';

import FeedbackScoreButtons from './FeedbackScoreButtons';

const headingStyles = css({
	fontSize: `${fontSize()}px`,
	fontWeight: 600,
});

interface Props {
	question: string;
	statement?: string;
	textPlaceholder: string;
	textLabel: string;
	onSubmit: OnSubmitHandler<FormValues>;
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

export default ({ question, statement, textPlaceholder, textLabel, onSubmit }: Props) => {
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
			<h1 id="contextualSurveyQuestion" css={headingStyles}>
				{question}
			</h1>
			{statement && <p id="contextualSurveyStatement">{statement}</p>}
			<Form onSubmit={onSubmit}>
				{({ formProps, submitting }) => (
					<form {...formProps}>
						<Field<number> name="feedbackScore" isDisabled={submitting} isRequired>
							{({ fieldProps }) => (
								<FeedbackScoreButtons
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
									// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
									css={css({
										transition: `max-height ${transitionDuration}ms ease-in-out`,
										overflow: 'hidden',
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
										maxHeight: getExpandedHeight(expandedAreaRef, state),
									})}
									ref={expandedAreaRef}
								>
									<Field<string, HTMLTextAreaElement>
										name="writtenFeedback"
										defaultValue=""
										isDisabled={submitting}
									>
										{({ fieldProps }) => (
											<Textarea
												{...fieldProps}
												aria-label={textLabel}
												placeholder={textPlaceholder}
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
									<FormFooter>
										<Button type="submit" appearance="primary" isLoading={submitting}>
											Submit
										</Button>
									</FormFooter>
								</div>
							)}
						</Transition>
					</form>
				)}
			</Form>
		</section>
	);
};
