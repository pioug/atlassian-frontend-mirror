import React, { StrictMode, useState } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { SurveyMarshal } from '../../../new';
import { type FormValues } from '../../../types';
import ContextualSurvey, { AUTO_DISAPPEAR_DURATION } from '../../ContextualSurvey';

jest.useFakeTimers();

type Props = {
	hasUserAnswered: boolean;
	onDismiss: () => void;
	onSubmit: (value: FormValues) => Promise<void>;
};

function App({ hasUserAnswered, onSubmit, onDismiss }: Props) {
	const [showSurvey, setShowSurvey] = useState(true);

	return (
		<StrictMode>
			<SurveyMarshal shouldShow={showSurvey}>
				{() => (
					<ContextualSurvey
						question="Question"
						statement="Statement"
						textLabel="Placeholder"
						onDismiss={() => {
							onDismiss();
							setShowSurvey(false);
						}}
						getUserHasAnsweredMailingList={() => {
							return Promise.resolve(hasUserAnswered);
						}}
						onMailingListAnswer={() => Promise.resolve()}
						onSubmit={onSubmit}
					/>
				)}
			</SurveyMarshal>
		</StrictMode>
	);
}

it('should allow a standard signup flow', async () => {
	const onSubmit = jest.fn().mockImplementation(() => {
		return Promise.resolve();
	});
	const onDismiss = jest.fn();
	const { container, getByLabelText, getByText, queryByText } = render(
		<App hasUserAnswered={false} onSubmit={onSubmit} onDismiss={onDismiss} />,
	);

	// clearing all mocks that may have results from a double render
	jest.clearAllMocks();

	// displaying form initially
	expect(getByText('Question')).toBeTruthy();
	expect(getByText('Statement')).toBeTruthy();

	// text area not visible yet
	expect(queryByText('Placeholder')).toBeFalsy();

	// click a score
	fireEvent.click(getByLabelText('Strongly agree'));

	// text area now visible
	const textArea: HTMLElement = getByLabelText('Placeholder');
	expect(textArea).toBeTruthy();

	const feedback: string = 'Custom response message';

	// Adding a message to textarea
	// This will also automatically check the "contact me" checkbox
	fireEvent.change(textArea, { target: { value: feedback } });

	const form: HTMLElement | null = container.querySelector('form');
	if (!form) {
		throw new Error('could not find form');
	}
	fireEvent.submit(form);

	expect(onSubmit).toHaveBeenCalledWith({
		// set to true by updating the feedback
		canContact: true,
		feedbackScore: 7,
		writtenFeedback: feedback,
	});

	// waiting for getUserHasAnsweredMailingList & onSubmit promises to resolve
	expect(
		await screen.findByText('Are you interested in participating in our research?'),
	).toBeInTheDocument();

	const signUp: HTMLElement | null = getByText('Yes, sign me up').closest('button');
	if (!signUp) {
		throw new Error('Unable to find signup button');
	}
	fireEvent.click(signUp);

	// waiting for mail signup promise resolve
	expect(await screen.findByText('Thanks for signing up')).toBeInTheDocument();

	expect(onDismiss).not.toHaveBeenCalled();

	// running auto dismiss
	act(() => {
		jest.advanceTimersByTime(AUTO_DISAPPEAR_DURATION);
	});

	expect(onDismiss).toHaveBeenCalled();
});
