import React, { useState } from 'react';

import Button from '@atlaskit/button';
import CheckIcon from '@atlaskit/icon/glyph/check';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import CrossIcon from '@atlaskit/icon/glyph/cross';
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
import { QuizElement, QuizInterface } from './types';

export interface Props {
  // Content for the quiz
  quizContent: QuizInterface;
  // Score that is showed after submitting answers
  score: number | null;
  // Correct answers for the particular quiz
  correctAnswers?: QuizElement | null;
  // Function to be executed when the submit button is pressed
  onSubmitButtonClick?: (choosenAnswers: string[]) => void;
  // Function to be executed when the next button is clicked
  onNextButtonClick?: () => void;
}

export interface State {
  currentQuestionNumber: number;
  checkedAnswers: Map<number, string>;
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
            <Question>
              {props.quizContent.questions[currentQuestionNumber]}
            </Question>
            {props.quizContent.answers[currentQuestionNumber].map(
              (answer, index) => {
                const checkedAnswer =
                  checkedAnswers && checkedAnswers.get(currentQuestionNumber);
                const correctAnswer =
                  props.correctAnswers &&
                  props.correctAnswers[currentQuestionNumber];
                return (
                  <Answer key={index}>
                    <Radio
                      value={answer}
                      label={answer}
                      name={answer}
                      isChecked={answer === checkedAnswer}
                      onChange={(e) => onChange(e, currentQuestionNumber)}
                    />
                    {props.score && correctAnswer && (
                      <span>
                        {answer === correctAnswer ? (
                          <CheckIcon label="right" primaryColor="green" />
                        ) : (
                          answer === checkedAnswer && (
                            <CrossIcon label="wrong" primaryColor="red" />
                          )
                        )}
                      </span>
                    )}
                  </Answer>
                );
              },
            )}
          </React.Fragment>
        ) : !props.score ? (
          <Spinner />
        ) : (
          <Score>
            <span>{`${props.score} / ${questionsNumber} Correct`}</span>
            {props.score >= questionsNumber / 2 ? (
              <span>Great job!</span>
            ) : (
              <span>Not bad!</span>
            )}
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
          <ChevronLeftLargeIcon
            label="prev"
            primaryColor="#5e6c84"
            size="large"
          />
          <NavAction>
            {isLastSlide && props.score ? 'Review' : 'Previous'}
          </NavAction>
        </NavQuiz>
        {isLastQuestion && !props.score ? (
          <Button
            appearance="primary"
            onClick={onSubmitButtonClick}
            isDisabled={isDisabledSubmit}
          >
            Submit
          </Button>
        ) : isLastSlide ? (
          <NavQuiz>
            <NavAction>Learn More</NavAction>
            <ChevronRightLargeIcon
              label="next"
              primaryColor="#5e6c84"
              size="large"
            />
          </NavQuiz>
        ) : (
          <NavQuiz onClick={handleNextClick}>
            <NavAction>Next</NavAction>
            <ChevronRightLargeIcon
              label="next"
              primaryColor="#5e6c84"
              size="large"
            />
          </NavQuiz>
        )}
      </Footer>
    </Quiz>
  );
};

export default QuizWidget;
