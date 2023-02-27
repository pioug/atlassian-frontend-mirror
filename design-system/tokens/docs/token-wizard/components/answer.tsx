/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import {
  B200,
  B50,
  B500,
  B75,
  N0,
  N30A,
  N40,
  N40A,
  N800,
} from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import { token } from '../../../src';
import { Answer, Path } from '../data/types';

const answerSummaryStyles = css({
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '24px',
});

const answerDescriptionStyles = css({
  marginTop: 4,
  fontSize: '14px',
  lineHeight: '20px',
});

const baseAnswerStyles = css({
  width: '100%',
  marginBottom: gridSize(),
  padding: '8px 12px',
  background: token('color.background.neutral.subtle', N0),
  border: `1px solid ${token('color.border', N40)}`,
  borderRadius: 8,
  color: token('color.text', N800),
  cursor: 'pointer',
  textAlign: 'start',
  '&:hover': {
    background: token('color.background.neutral.subtle.hovered', N30A),
  },
  '&:active': {
    background: token('color.background.neutral.subtle.pressed', N40A),
  },
});

const selectedStyles = css({
  background: token('color.background.selected', B50),
  borderColor: token('color.border.selected', B500),
  color: token('color.text.selected', B500),
  '&:hover': {
    background: token('color.background.selected.hovered', B75),
  },
  '&:active': {
    background: token('color.background.selected.pressed', B200),
  },
});

/**
 * __Answer card__
 *
 * An answer card on the left hand side of the token wizard modal
 *
 */
const AnswerCard = ({
  answer,
  onClick,
  path,
}: {
  answer: Answer;
  onClick: () => void;
  path: [Path] | [];
}) => {
  const selected = !!path.find((qs) => qs.answer === answer.summary);
  return (
    <button
      type="button"
      css={[baseAnswerStyles, selected && selectedStyles]}
      key={answer.summary}
      onClick={onClick}
    >
      <h5
        css={answerSummaryStyles}
        style={{
          color: selected
            ? token('color.text.selected', B500)
            : token('color.text', N800),
        }}
      >
        {answer.summary}
      </h5>
      {answer.description && (
        <p css={answerDescriptionStyles}>{answer.description}</p>
      )}
    </button>
  );
};

export default AnswerCard;
