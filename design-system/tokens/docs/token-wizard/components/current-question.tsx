/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { B400, N0 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import { token } from '../../../src';
import questions from '../data/questions';
import { Question, questionID } from '../types';

const questionContainerStyles = css({
  background: token('color.background.selected.bold', B400),
  borderRadius: 8,
  padding: gridSize() * 2,
  marginBottom: gridSize() * 1.5,
});

const questionStyles = css({
  fontSize: '20px',
  lineHeight: '24px',
  fontWeight: 500,
  color: token('color.text.inverse', N0),
});

const questionDescriptionStyles = css({
  fontSize: '14px',
  lineHeight: '20px',
  color: token('color.text.inverse', N0),
});

/**
 * __Current question__
 *
 * A current question on the bottom of question list on the right-hand-side token wizard modal dialog.
 *
 */
const CurrentQuestion = ({ questionId }: { questionId: questionID }) => {
  const question: Question = questions[questionId];
  return (
    <div css={questionContainerStyles}>
      <h5 css={questionStyles}>{question.title}</h5>
      {question.metadata?.description && (
        <p css={questionDescriptionStyles}>{question.metadata?.description}</p>
      )}
    </div>
  );
};

export default CurrentQuestion;
