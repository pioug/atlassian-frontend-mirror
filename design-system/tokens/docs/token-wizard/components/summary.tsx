/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import { B400, B50 } from '@atlaskit/theme/colors';
import { fontSize, gridSize } from '@atlaskit/theme/constants';

import { token } from '../../../src';
import { Path } from '../types';

const summaryContainerStyles = css({
  display: 'grid',
  padding: gridSize() * 2,
  alignItems: 'center',
  columnGap: gridSize() * 0.5,
  gridTemplateColumns: '16fr 16fr 1fr',
  background: token('color.background.selected', B50),
  border: `1px solid ${token('color.border.selected', B400)}`,
  borderRadius: 8,
  color: token('color.text.selected', B400),
  cursor: 'pointer',
});

const questionSummaryStyles = css({
  margin: 0,
  fontSize: '12px',
  fontWeight: 600,
  textAlign: 'left',
});

const answerSummaryStyles = css({
  margin: 0,
  fontSize: fontSize(),
  justifySelf: 'end',
  textAlign: 'end',
});
/**
 * __Summary__
 *
 * A summary button that displays the previous selections on the left-hand-side modal dialog.
 *
 */
const Summary = ({
  questionAndAnswerSummary,
  onClick,
  isPending,
}: {
  questionAndAnswerSummary: Path;
  onClick: () => void;
  isPending: boolean;
}) => {
  return (
    <button
      css={summaryContainerStyles}
      style={{
        margin: isPending ? '0 16px 12px ' : '0 0 12px',
      }}
      onClick={onClick}
      key={questionAndAnswerSummary.question}
      type="button"
    >
      <p css={questionSummaryStyles}>{questionAndAnswerSummary.question}</p>
      <p css={answerSummaryStyles}>{questionAndAnswerSummary.answer}</p>
      <ChevronRightIcon label="expand" size="medium" />
    </button>
  );
};

export default Summary;
