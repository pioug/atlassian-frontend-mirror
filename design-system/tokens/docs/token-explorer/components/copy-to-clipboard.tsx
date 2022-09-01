/** @jsx jsx */
import {
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { jsx } from '@emotion/react';

import ToolTip from '@atlaskit/tooltip';

interface CopyToClipboardProps {
  /**
   * The value to copy to the clipboard.
   */
  value: string;
  /**
   * A render prop which provides a `copy` handler to be passed to the trigger element.
   */
  children: ({ copy }: { copy: () => void }) => ReactNode;
  /**
   * Override messaging displayed for current state.
   */
  messages?: {
    prompt: string;
    success: string;
    fail: string;
  };
}

/**
 * __Copy to clipboard__
 *
 * Copies text to clipboard.
 */
const CopyToClipboard = ({
  value,
  children,
  messages = {
    prompt: 'Copy to clipboard',
    success: 'Copied!',
    fail: 'Copy failed',
  },
}: CopyToClipboardProps) => {
  const [copyMessage, setCopyMessage] = useState<string>(messages.prompt);

  const resetPrompt = useCallback(() => {
    setCopyMessage(messages.prompt);
  }, [messages.prompt]);

  const onCopy = () => {
    try {
      navigator.clipboard.writeText(value).then(
        () => {
          setCopyMessage(messages.success);
          setTimeout(() => {
            resetPrompt();
          }, 1000);
        },
        () => setCopyMessage(messages.fail),
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Unable to copy text');
    }
  };

  // Update positioning of ToolTip
  const updateTooltip = useRef<() => void>();
  useLayoutEffect(() => {
    updateTooltip.current?.();
  }, [copyMessage]);

  return (
    <ToolTip
      content={({ update }) => {
        updateTooltip.current = update;
        return copyMessage;
      }}
      onHide={resetPrompt}
      position="top"
    >
      {children({ copy: onCopy })}
    </ToolTip>
  );
};

export default CopyToClipboard;
