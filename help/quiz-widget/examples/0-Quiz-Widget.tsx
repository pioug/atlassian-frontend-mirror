import React, { useState } from 'react';

import { QuizWidget } from '../src';
import { type QuizElement } from '../src/components/QuizWidget/types';
import { QuizWrapper } from '../src/styled';

export const quizContent = {
	name: 'Quiz 1',
	questions: {
		1: 'Which button do you press?',
		2: 'Choose a color',
		3: 'Which fruit do you choose?',
		4: 'Which is better?',
	},
	answers: {
		1: ['Release', 'Star', 'Lightning Bolt'],
		2: ['Red', 'Orange', 'Blue'],
		3: ['Apple', 'Apricot', 'Pear'],
		4: ['Hello', 'Bye', 'Hi'],
	},
};

const correctAnswers = {
	1: 'Star',
	2: 'Blue',
	3: 'Apricot',
	4: 'Hi',
};

const Basic: React.FC = () => {
	const [score, setScore] = useState<number | null>(null);
	const [correctAnswersState, setCorrectAnswersState] = useState<QuizElement | null>(null);

	const onSubmitButtonClick = (chosenAnswers: string[]) => {
		setScore(3);
		setCorrectAnswersState(correctAnswers);
	};

	return (
		<QuizWrapper>
			<QuizWidget
				quizContent={quizContent}
				score={score}
				correctAnswers={correctAnswersState}
				onSubmitButtonClick={onSubmitButtonClick}
			/>
		</QuizWrapper>
	);
};

export default Basic;
