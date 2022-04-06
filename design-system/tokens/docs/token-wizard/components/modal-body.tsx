/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/core';

import { N40 } from '@atlaskit/theme/colors';

import { token } from '../../../src';
import questions from '../data/questions';
import { Answer, Path, questionID, resultID } from '../types';

import AnswerCard from './answer';
import CurrentQuestion from './current-question';
import ResultPanel from './result-panel';
import Summary from './summary';

const BREAKPOINT = 912;

const gridStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  columnGap: 16,
  paddingBottom: 32,

  [`@media (min-width: ${BREAKPOINT}px)`]: {
    gridTemplateColumns: '1fr 1fr',
    height: 'calc(100% - 32px)',
  },
});

const leftContainerStyles = css({
  borderRadius: 8,
  border: `1px solid ${token('color.border', N40)}`,
  padding: 16,

  [`@media (min-width: ${BREAKPOINT}px)`]: {
    height: 492,
    overflow: 'scroll',
  },
});

const selectAnswerStyles = css({
  marginBottom: 8,
  lineHeight: '20px',
  fontSize: '14px',
});

/**
 * __Token wizard modal body__
 *
 * Modal body of the token wizard modal dialog.
 *
 */
const TokenWizardModalBody = () => {
  const [currentQuestionId, setCurrentQuestionId] = useState<questionID>(
    'root',
  );
  const [path, setPath] = useState<[Path] | []>([]);
  const [resultId, setResultId] = useState<resultID | ''>('');

  const onClickAnswer = ({
    questionId,
    answer,
  }: {
    questionId: questionID;

    answer: Answer;
  }) => {
    const selectedIndex = path.findIndex((qs) => qs.questionId === questionId);
    if (selectedIndex >= 0) {
      const newPath = path
        //@ts-ignore
        .map((qs, index) => {
          if (index <= selectedIndex) {
            return qs.questionId === questionId
              ? {
                  questionId: questionId,
                  question: questions[questionId].summary,
                  answer: answer.summary,
                }
              : qs;
          }
        })
        .filter((item: any) => item);
      setPath(newPath as [Path]);
    } else {
      setPath([
        ...path,
        {
          questionId,
          question: questions[questionId].summary,
          answer: answer.summary,
        },
      ] as [Path]);
    }

    return answer.result
      ? setResultId(answer.result)
      : setCurrentQuestionId(answer.next);
  };

  const onClickSummary = (questionId: questionID) => {
    setCurrentQuestionId(questionId);
    setResultId('');
  };

  const renderPathList = (path: [Path] | []) => {
    const currentIndex = path.findIndex(
      (qs) => qs.questionId === currentQuestionId,
    );
    //@ts-ignore
    return path.map((questionAndAnswer, index) => {
      return questionAndAnswer.questionId === currentQuestionId && !resultId ? (
        <CurrentQuestion
          key={currentQuestionId}
          questionId={currentQuestionId}
        />
      ) : (
        <Summary
          key={questionAndAnswer.questionId}
          isPending={currentIndex >= 0 && index > currentIndex}
          onClick={() => onClickSummary(questionAndAnswer.questionId)}
          questionAndAnswerSummary={questionAndAnswer}
        />
      );
    });
  };

  const renderAnswers = (questionId: questionID) => {
    return (
      <div css={leftContainerStyles}>
        <p css={selectAnswerStyles}>Select an answer</p>
        {questions[questionId].answers.map((answer: Answer) => (
          <AnswerCard
            key={answer.summary}
            path={path}
            answer={answer}
            onClick={() => onClickAnswer({ questionId, answer })}
          />
        ))}
      </div>
    );
  };

  return (
    <div css={gridStyles}>
      <div>
        {renderPathList(path)}
        {(path.length === 0 ||
          !path.find((qs) => qs.questionId === currentQuestionId)) && (
          <CurrentQuestion questionId={currentQuestionId} />
        )}
      </div>
      {resultId ? (
        <ResultPanel resultId={resultId} />
      ) : (
        renderAnswers(currentQuestionId)
      )}
    </div>
  );
};

export default TokenWizardModalBody;
