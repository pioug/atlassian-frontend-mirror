import React, { useState } from 'react';

import Button from '@atlaskit/button';
import CheckIcon from '@atlaskit/icon/core/migration/check-mark--check';
import ChevronLeftLargeIcon from '@atlaskit/icon/core/migration/chevron-left--chevron-left-large';
import ChevronRightLargeIcon from '@atlaskit/icon/core/migration/chevron-right--chevron-right-large';
import CrossIcon from '@atlaskit/icon/core/migration/cross';
import { Radio } from '@atlaskit/radio';
import Spinner from '@atlaskit/spinner';
import {
	Answer,
	Footer,
	Header,
	NavQuiz,
	Question,
	Quiz,
	QuizBlock,
	QuizName,
	Score,
	NavAction,
} from './styled';
import { type QuizElement, type QuizInterface } from './types';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Flex, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const boxWrapperStyles = xcss({
	width: '32px',
	height: '32px',
	// NOTE: custom color is used here
	// @ts-ignore
	color: '#5e6c84',
});

export interface Props {
	// Correct answers for the particular quiz
	correctAnswers?: QuizElement | null;
	// Function to be executed when the next button is clicked
	onNextButtonClick?: () => void;
	// Function to be executed when the submit button is pressed
	onSubmitButtonClick?: (choosenAnswers: string[]) => void;
	// Content for the quiz
	quizContent: QuizInterface;
	// Score that is showed after submitting answers
	score: number | null;
}

export interface State {
	checkedAnswers: Map<number, string>;
	currentQuestionNumber: number;
}

const QuizWidget = (props: Props) => {
	const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
	const [checkedAnswers, setCheckedAnswers] = useState(new Map());

	const onChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const value = e.currentTarget.value;
		!props.score
			? setCheckedAnswers((prevState) => new Map(prevState).set(index, value))
			: setCheckedAnswers(checkedAnswers);
	};

	const handlePrevClick = () => {
		setCurrentQuestionNumber(currentQuestionNumber - 1);
	};

	const handleNextClick = () => {
		props.onNextButtonClick && props.onNextButtonClick();
		setCurrentQuestionNumber(currentQuestionNumber + 1);
	};

	const onSubmitButtonClick = () => {
		const chosenQuizAnswers: string[] = Array.from(checkedAnswers.values());
		props.onSubmitButtonClick && props.onSubmitButtonClick(chosenQuizAnswers);
		setCurrentQuestionNumber(currentQuestionNumber + 1);
	};

	const questionsNumber = Object.keys(props.quizContent.questions).length;
	const isLastSlide = currentQuestionNumber === questionsNumber + 1;
	const isLastQuestion = currentQuestionNumber === questionsNumber;
	const isDisabledSubmit = checkedAnswers.size !== questionsNumber;

	return (
		<Quiz>
			<Header>
				<QuizName>{props.quizContent.name}</QuizName>
			</Header>
			<QuizBlock>
				{!isLastSlide ? (
					<React.Fragment>
						<Question>{props.quizContent.questions[currentQuestionNumber]}</Question>
						{props.quizContent.answers[currentQuestionNumber].map((answer, index) => {
							const checkedAnswer = checkedAnswers && checkedAnswers.get(currentQuestionNumber);
							const correctAnswer =
								props.correctAnswers && props.correctAnswers[currentQuestionNumber];
							return (
								<Answer key={index}>
									<Radio
										value={answer}
										label={answer}
										name={answer}
										isChecked={answer === checkedAnswer}
										//error TS7006: Parameter 'e' implicitly has an 'any' type.
										//@fixme TypeScript 4.2.4 upgrade
										onChange={(e: any) => onChange(e, currentQuestionNumber)}
									/>
									{props.score && correctAnswer && (
										<span>
											{answer === correctAnswer ? (
												<CheckIcon
													spacing="spacious"
													label="right"
													color={token('color.icon.success')}
												/>
											) : (
												answer === checkedAnswer && (
													<CrossIcon
														spacing="spacious"
														label="wrong"
														color={token('color.icon.danger')}
													/>
												)
											)}
										</span>
									)}
								</Answer>
							);
						})}
					</React.Fragment>
				) : !props.score ? (
					<Spinner />
				) : (
					<Score>
						<span>{`${props.score} / ${questionsNumber} Correct`}</span>
						{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
						{props.score >= questionsNumber / 2 ? <span>Great job!</span> : <span>Not bad!</span>}
					</Score>
				)}
			</QuizBlock>
			<Footer>
				<NavQuiz
					style={{
						visibility: currentQuestionNumber !== 1 ? 'visible' : 'hidden',
					}}
					onClick={handlePrevClick}
				>
					<Flex alignItems="center">
						<Flex xcss={boxWrapperStyles} alignItems="center" justifyContent="center">
							<ChevronLeftLargeIcon
								label="prev"
								color="currentColor"
								LEGACY_size="large"
								size="small"
							/>
						</Flex>
						<NavAction>{isLastSlide && props.score ? 'Review' : 'Previous'}</NavAction>
					</Flex>
				</NavQuiz>
				{isLastQuestion && !props.score ? (
					<Button appearance="primary" onClick={onSubmitButtonClick} isDisabled={isDisabledSubmit}>
						Submit
					</Button>
				) : isLastSlide ? (
					<NavQuiz>
						<Flex alignItems="center">
							<NavAction>Learn More</NavAction>
							<Flex xcss={boxWrapperStyles} alignItems="center" justifyContent="center">
								<ChevronRightLargeIcon
									label="next"
									color="currentColor"
									LEGACY_size="large"
									size="small"
								/>
							</Flex>
						</Flex>
					</NavQuiz>
				) : (
					<NavQuiz onClick={handleNextClick}>
						<Flex alignItems="center">
							<NavAction>Next</NavAction>
							<Flex xcss={boxWrapperStyles} alignItems="center" justifyContent="center">
								<ChevronRightLargeIcon
									label="next"
									color="currentColor"
									LEGACY_size="large"
									size="small"
								/>
							</Flex>
						</Flex>
					</NavQuiz>
				)}
			</Footer>
		</Quiz>
	);
};

export default QuizWidget;
