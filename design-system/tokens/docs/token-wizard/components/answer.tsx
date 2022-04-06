/** @jsx jsx */
import { useMemo } from 'react';

import { css, CSSObject, jsx } from '@emotion/core';

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
import { Answer, Path } from '../types';

const answerSummaryStyles = css({
  fontSize: '20px',
  lineHeight: '24px',
  fontWeight: 500,
});

const answerDescriptionStyles = css({
  marginTop: 4,
  lineHeight: '20px',
  fontSize: '14px',
});

const getAnswerStyled = (selected: boolean): CSSObject => ({
  cursor: 'pointer',
  borderRadius: 8,
  textAlign: 'start',
  border: `1px solid ${
    selected ? token('color.border.selected', B500) : token('color.border', N40)
  }`,
  padding: '8px 12px',
  width: '100%',
  background: selected
    ? token('color.background.selected', B50)
    : token('color.background.neutral.subtle', N0),
  marginBottom: gridSize(),
  color: selected
    ? token('color.text.selected', B500)
    : token('color.text', N800),

  '&:hover': {
    background: selected
      ? token('color.background.selected.hovered', B75)
      : token('color.background.neutral.subtle.hovered', N30A),
  },

  '&:active': {
    background: selected
      ? token('color.background.selected.pressed', B200)
      : token('color.background.neutral.subtle.pressed', N40A),
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

  const styles = useMemo(() => getAnswerStyled(selected), [selected]);

  return (
    <button type="button" css={styles} key={answer.summary} onClick={onClick}>
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
