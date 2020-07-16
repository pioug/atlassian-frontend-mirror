import React from 'react';
import { TextWithAnnotationDraft } from '../../ui/annotations';

type Props = {
  startPos: number;
  endPos: number;
  text?: string | null;
};

const TextWrapper = React.memo((props: Props) => {
  const { startPos, endPos } = props;
  const { text } = props;

  if (!text) {
    return null;
  }

  return (
    <TextWithAnnotationDraft text={text} startPos={startPos} endPos={endPos} />
  );
});

export default TextWrapper;
