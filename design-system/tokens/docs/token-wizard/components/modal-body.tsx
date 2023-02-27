/** @jsx jsx */
import { useEffect, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { N40 } from '@atlaskit/theme/colors';

import { token } from '../../../src';
import questions from '../data/questions';
import { Answer, Path, questionID, resultID } from '../data/types';

import AnswerCard from './answer';
import CurrentQuestion from './current-question';
import ResultPanel from './result-panel';
import Summary from './summary';

const BREAKPOINT = 912;

const gridStyles = css({
  display: 'grid',
  paddingBottom: 32,
  columnGap: 16,
  gridTemplateColumns: '1fr',
  [`@media (min-width: ${BREAKPOINT}px)`]: {
    height: 'calc(100% - 32px)',
    gridTemplateColumns: '1fr 1fr',
  },
});

const leftContainerStyles = css({
  padding: 16,
  border: `1px solid ${token('color.border', N40)}`,
  [`@media (min-width: ${BREAKPOINT}px)`]: {
    height: 492,
    overflow: 'scroll',
  },
});

const selectAnswerStyles = css({
  marginBottom: 8,
  fontSize: '14px',
  lineHeight: '20px',
});

/**
 * __Token wizard modal body__
 *
 * Modal body of the token wizard modal dialog.
 *
 */
const TokenWizardModalBody = ({
  params,
  removeParamsInUrl,
}: {
  params: Record<string, resultID | boolean | string>;
  removeParamsInUrl: () => void;
}) => {
  const [currentQuestionId, setCurrentQuestionId] =
    useState<questionID>('root');
  const [path, setPath] = useState<[Path] | []>([]);
  const [resultId, setResultId] = useState<resultID | ''>('');

  useEffect(() => {
    if (Object.keys(params).length) {
      try {
        const questionIdList = Object.keys(params).filter(
          (param) => param !== 'resultId' && param !== 'isTokenPickerOpen',
        );
        if (
          questionIdList.some(
            (questionId: string) =>
              !questions.hasOwnProperty(questionId) ||
              //@ts-ignore
              !questions[questionId]?.answers
                .map((answer: Answer) => answer.summary)
                .includes(params[questionId]),
          ) ||
          !Object.keys(params).includes('resultId')
        ) {
          // eslint-disable-next-line no-console
          console.error('Invalid query parameters in URL');
          return;
        }

        const pathInSearchParam = questionIdList.map((questionId) => ({
          questionId,
          //@ts-ignore
          question: questions[questionId].summary,
          answer: params[questionId],
        }));
        setResultId(params.resultId as resultID);
        setPath(pathInSearchParam as [Path]);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Invalid query parameters in URL');
      }
    }
  }, [params]);

  const resetQueryParams = () => {
    if (Object.keys(params).length) {
      removeParamsInUrl();
    }
  };

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

    if (answer.result) {
      resetQueryParams();
      setResultId(answer.result);
    } else {
      setCurrentQuestionId(answer.next);
    }
  };

  const onClickSummary = (questionId: questionID) => {
    setCurrentQuestionId(questionId);
    setResultId('');
  };

  const onClickStartAgain = () => {
    resetQueryParams();
    setCurrentQuestionId('root');
    setPath([]);
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
        <ResultPanel
          resultId={resultId}
          onClickStartAgain={onClickStartAgain}
          path={path}
        />
      ) : (
        renderAnswers(currentQuestionId)
      )}
    </div>
  );
};

export default TokenWizardModalBody;
