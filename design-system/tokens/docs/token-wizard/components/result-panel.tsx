/** @jsx jsx */
import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import LinkIcon from '@atlaskit/icon/glyph/link';
import { N40 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import Tooltip from '@atlaskit/tooltip';

import { token } from '../../../src';
import results from '../data/results';
import { Path, resultID } from '../data/types';

import TokenItem from './token-item';

const headerStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const leftContainerStyles = css({
  padding: 16,
  border: `1px solid ${token('color.border', N40)}`,
  borderRadius: 8,
  '@media (min-width: 480px)': {
    height: 492,
    overflow: 'scroll',
  },
});

const resultTitleStyles = css({
  margin: 0,
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '24px',
});

const dividerStyles = css({
  height: gridSize() * 2,
  border: 'none',
  borderTop: `1px solid ${token('color.border', '#ebecf0')}`,
});

const COPY_MESSAGE = {
  PROMPT: 'Copy result link',
  SUCCESS: 'Copied',
  FAILURE: 'Copy failed',
};

/**
 * __Result panel__
 *
 * A result panel on the right-hand-side modal dialog to display suggested tokens and descriptions
 *
 */
const ResultPanel = ({
  resultId,
  onClickStartAgain,
  path,
}: {
  resultId: resultID;
  onClickStartAgain: () => void;
  path: Path[];
}) => {
  const [copyMessage, setCopyMessage] = useState<string>(COPY_MESSAGE.PROMPT);

  const handleSuccess = useCallback(() => {
    setCopyMessage(COPY_MESSAGE.SUCCESS);
  }, [setCopyMessage]);

  const handleError = useCallback(() => {
    setCopyMessage(COPY_MESSAGE.FAILURE);
  }, [setCopyMessage]);

  const resetPrompt = () => setCopyMessage(COPY_MESSAGE.PROMPT);

  const onCopy = () => {
    try {
      const paramObject: { [key: string]: string } = {
        isTokenPickerOpen: encodeURIComponent(true),
        resultId: encodeURIComponent(resultId),
      };
      path.forEach(({ questionId, answer }) => {
        const encodedQuestionId = encodeURIComponent(questionId);
        paramObject[encodedQuestionId] = encodeURIComponent(answer);
      });
      const link =
        window.location.href.split('?')[0] +
        '?' +
        new URLSearchParams(paramObject).toString();
      navigator.clipboard.writeText(link).then(handleSuccess, handleError);
      setTimeout(() => {
        resetPrompt();
      }, 1000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Unable to copy link');
    }
  };

  const updateTooltip = useRef<() => void>();
  useLayoutEffect(() => {
    updateTooltip.current?.();
  }, [copyMessage]);

  return (
    <div css={leftContainerStyles}>
      <div css={[headerStyles, { marginBottom: gridSize() * 4 }]}>
        <div css={[headerStyles, { columnGap: 4 }]}>
          <Tooltip
            content={({ update }) => {
              updateTooltip.current = update;
              return copyMessage;
            }}
            position="top"
            onHide={resetPrompt}
          >
            {(tooltipProps) => (
              <Button
                appearance="subtle"
                iconBefore={<LinkIcon label="" size="small" />}
                {...tooltipProps}
                onClick={onCopy}
              />
            )}
          </Tooltip>
          <h5 css={resultTitleStyles}>Your token is:</h5>
        </div>
        <Button appearance="subtle" onClick={onClickStartAgain}>
          Start again
        </Button>
      </div>
      {results[resultId].map((token, index) => {
        return (
          <Fragment key={token.name}>
            <TokenItem
              tokenName={token.name}
              pairings={token.pairings?.find(
                (item) => item.background === token.name,
              )}
            />
            {index < results[resultId].length - 1 && <hr css={dividerStyles} />}
          </Fragment>
        );
      })}
    </div>
  );
};

export default ResultPanel;
