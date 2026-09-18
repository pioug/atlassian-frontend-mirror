import React from 'react';

import { fireEvent, render, type RenderResult } from '@testing-library/react';

import { quizContent } from '../../../examples/0-Quiz-Widget';
import QuizWidget from '../../components/QuizWidget/index';

describe('QuizWidget', () => {
	let quizComponent: RenderResult;

	beforeEach(() => {
		quizComponent = render(<QuizWidget score={3} quizContent={quizContent} />, {
			container: document.createElement('div'),
		});
	});

	it('should capture and report a11y violations', async () => {
		await expect(quizComponent.getAllByRole('radio')[0].parentElement).toBeAccessible();
	});

	it('should render quiz with provided name', () => {
		expect(quizComponent.getByText(quizContent.name)).toHaveTextContent(quizContent.name);
	});

	it('should render question and proposed answers', () => {
		expect(quizComponent.getByText(quizContent.questions[1])).toHaveTextContent(
			quizContent.questions[1],
		);
		expect(quizComponent.getAllByRole('radio')).toHaveLength(quizContent.answers[1].length);
	});

	it('should show next question by clicking next button', () => {
		expect(quizComponent.getByText(quizContent.questions[1])).toHaveTextContent(
			quizContent.questions[1],
		);
		fireEvent.click(quizComponent.getByText('Next'));
		expect(quizComponent.getByText(quizContent.questions[2])).toHaveTextContent(
			quizContent.questions[2],
		);
	});

	it('should show previous question by clicking previous button', () => {
		fireEvent.click(quizComponent.getByText('Next'));
		expect(quizComponent.getByText(quizContent.questions[2])).toHaveTextContent(
			quizContent.questions[2],
		);
		fireEvent.click(quizComponent.getByText('Previous'));
		expect(quizComponent.getByText(quizContent.questions[1])).toHaveTextContent(
			quizContent.questions[1],
		);
	});
});
