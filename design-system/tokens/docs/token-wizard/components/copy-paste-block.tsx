/** @jsx jsx */
import {
  Fragment,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/react';

import FocusRing from '@atlaskit/focus-ring';
import Tooltip from '@atlaskit/tooltip';

const COPY_MESSAGE = {
  PROMPT: 'Copy to clipboard',
  SUCCESS: 'Copied',
  FAILURE: 'Copy failed',
};

const copyButtonStyles = css({
  padding: 0,
  background: 'none',
  border: 'none',
});

const textStyles = css({
  display: 'inline-block',
  margin: 0,
  textAlign: 'center',
});

/**
 * __Token__
 *
 * A copy and paste block on the result panel.
 *
 */
const CopyPasteBlock = ({
  text,
  renderWrapper,
}: {
  text: string;
  renderWrapper: (copyContent: ReactNode) => JSX.Element;
}) => {
  const [copyMessage, setCopyMessage] = useState<string>(COPY_MESSAGE.PROMPT);

  const handleSuccess = useCallback(() => {
    setCopyMessage(COPY_MESSAGE.SUCCESS);
  }, [setCopyMessage]);

  const handleError = useCallback(() => {
    setCopyMessage(COPY_MESSAGE.FAILURE);
  }, [setCopyMessage]);

  const onCopy = () => {
    try {
      navigator.clipboard.writeText(text).then(handleSuccess, handleError);
      setTimeout(() => {
        resetPrompt();
      }, 1000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Unable to copy text');
    }
  };
  const resetPrompt = () => setCopyMessage(COPY_MESSAGE.PROMPT);

  const renderCopyContent = () => (
    <Fragment>
      <p css={textStyles}>{text}</p>
    </Fragment>
  );

  const updateTooltip = useRef<() => void>();
  useLayoutEffect(() => {
    updateTooltip.current?.();
  }, [copyMessage]);

  return (
    <Tooltip
      content={({ update }) => {
        updateTooltip.current = update;
        return copyMessage;
      }}
      position="top"
      onHide={resetPrompt}
    >
      {(tooltipProps) => (
        <FocusRing>
          <button
            type="button"
            css={copyButtonStyles}
            {...tooltipProps}
            onClick={(e) => {
              tooltipProps.onClick(e);
              onCopy();
            }}
          >
            {renderWrapper(renderCopyContent())}
          </button>
        </FocusRing>
      )}
    </Tooltip>
  );
};

export default CopyPasteBlock;
