import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import QuizWidget from '../../components/QuizWidget/index';
import { quizContent } from '../../../examples/0-Quiz-Widget';
import {
  NavQuiz,
  Question,
  QuizName,
  Answer,
} from '../../components/QuizWidget/styled';

describe('QuizWidget', () => {
  let quizComponent: ReactWrapper;
  beforeEach(() => {
    quizComponent = mount(<QuizWidget score={3} quizContent={quizContent} />);
  });

  it('should render quiz with provided name', () => {
    const name = quizComponent.find(QuizName);
    expect(name.text()).toEqual(quizContent.name);
  });

  it('should render question and proposed answers', () => {
    const question = quizComponent.find(Question);
    expect(question.text()).toEqual(quizContent.questions[1]);
    const proposedAnswers = quizComponent.find(Answer);
    expect(proposedAnswers).toHaveLength(quizContent.answers[1].length);
  });

  it('should show next question by clicking next button', () => {
    expect(quizComponent.find(Question).text()).toEqual(
      quizContent.questions[1],
    );
    const nextButton = quizComponent
      .find(NavQuiz)
      .filterWhere((n: any) => n.childAt(0).text() === 'Next');
    nextButton.simulate('click');
    expect(quizComponent.find(Question).text()).toEqual(
      quizContent.questions[2],
    );
  });

  it('should show previous question by clicking previous button', () => {
    const nextButton = quizComponent
      .find(NavQuiz)
      .filterWhere((n: any) => n.childAt(0).text() === 'Next');
    nextButton.simulate('click');
    const prevButton = quizComponent
      .find(NavQuiz)
      .filterWhere((n: any) => n.childAt(0).text() === 'Previous');
    expect(quizComponent.find(Question).text()).toEqual(
      quizContent.questions[2],
    );
    prevButton.simulate('click');
    expect(quizComponent.find(Question).text()).toEqual(
      quizContent.questions[1],
    );
  });
});
