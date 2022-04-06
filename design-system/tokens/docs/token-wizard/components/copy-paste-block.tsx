/** @jsx jsx */
import { Fragment, ReactNode, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import FocusRing from '@atlaskit/focus-ring';
import LinkIcon from '@atlaskit/icon/glyph/link';

const COPY_MESSAGE = {
  PROMPT: '',
  SUCCESS: 'Copied',
  FAILURE: 'Copy to clipboard failed',
};

const copyButtonStyles = css({
  border: 'none',
  background: 'none',
  padding: 0,

  svg: {
    display: 'none',
  },

  '&:hover, &:focus': {
    svg: {
      display: 'inline-block',
    },

    p: {
      transform: 'translateX(0)',
      transition: 'transform 100ms ease-out',
    },
  },
});

const textStyles = css({
  display: 'inline-block',
  margin: 0,
  textAlign: 'center',
  transform: 'translateX(8px)',
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
  const [copyMessage, setCopyMessage] = useState<string>(text);

  const handleSuccess = useCallback(() => {
    setCopyMessage(COPY_MESSAGE.SUCCESS);
  }, [setCopyMessage]);

  const handleError = useCallback(() => {
    setCopyMessage(COPY_MESSAGE.FAILURE);
  }, [setCopyMessage]);

  const onCopy = () => {
    try {
      navigator.clipboard.writeText(text).then(handleSuccess, handleError);
      // setCopiedTextType(type);
      setTimeout(() => {
        setCopyMessage(text);
      }, 400);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Unable to copy text');
    }
  };

  const renderCopyContent = () => (
    <Fragment>
      <p css={textStyles}>{copyMessage}</p>
      {copyMessage === text && <LinkIcon label="copy" size="small" />}
    </Fragment>
  );

  return (
    <FocusRing>
      <button onClick={onCopy} type="button" css={copyButtonStyles}>
        {renderWrapper(renderCopyContent())}
      </button>
    </FocusRing>
  );
};

export default CopyPasteBlock;
