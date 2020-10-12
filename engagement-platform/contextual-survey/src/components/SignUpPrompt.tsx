/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import { fontSize, gridSize } from '@atlaskit/theme/constants';

import SuccessContainer from './SuccessContainer';

interface Props {
  onAnswer: (answer: boolean) => Promise<void>;
}

type PendingAnswer = 'yes' | 'no';

type Optional<T> = T | null;

export default ({ onAnswer }: Props) => {
  const [pending, setPending] = useState<Optional<PendingAnswer>>(null);
  const answeredWith = useCallback(
    async (answer: boolean) => {
      setPending(answer ? 'yes' : 'no');
      await onAnswer(answer);
    },
    [setPending, onAnswer],
  );

  const isDisabled: boolean = Boolean(pending);

  return (
    <SuccessContainer>
      <h1
        css={css`
          font-size: ${fontSize()}px;
          font-weight: 600;
          margin: 0;
          line-height: ${gridSize() * 3}px;
        `}
      >
        Thanks for your feedback
      </h1>
      <p>Are you interested in participating in our research?</p>
      <p>
        Sign up for the{' '}
        <a href="https://www.atlassian.com/research-group">
          Atlassian Research Group
        </a>{' '}
        and we may contact you in the future with research opportunities.
      </p>

      <div
        css={css`
          margin-top: ${gridSize() * 4}px;
          display: flex;
          justify-content: flex-end;

          & > * + * {
            margin-left: ${gridSize()}px;
          }
        `}
      >
        <Button
          appearance="subtle"
          onClick={() => answeredWith(false)}
          isDisabled={isDisabled}
          isLoading={pending === 'no'}
        >
          No, thanks
        </Button>
        <Button
          appearance="primary"
          onClick={() => answeredWith(true)}
          isDisabled={isDisabled}
          isLoading={pending === 'yes'}
        >
          Yes, sign me up
        </Button>
      </div>
    </SuccessContainer>
  );
};
