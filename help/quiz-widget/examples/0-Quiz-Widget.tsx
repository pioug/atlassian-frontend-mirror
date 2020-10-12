import React, { Component } from 'react';

import { QuizWidget } from '../src';
import { QuizElement } from '../src/components/QuizWidget/types';
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

interface State {
  score: number | null;
  correctAnswers: QuizElement | null;
}

export default class Basic extends Component<{}, State> {
  state: State = {
    score: null,
    correctAnswers: null,
  };

  onSubmitButtonClick = (chosenAnswers: string[]) => {
    this.setState({ score: 3, correctAnswers });
  };

  render() {
    return (
      <QuizWrapper>
        <QuizWidget
          quizContent={quizContent}
          score={this.state.score}
          correctAnswers={this.state.correctAnswers}
          onSubmitButtonClick={this.onSubmitButtonClick}
        />
      </QuizWrapper>
    );
  }
}
