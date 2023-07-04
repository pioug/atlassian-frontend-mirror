import React, { ReactNode } from 'react';
import { TextWithAnnotationDraft } from '../../ui/annotations';

type Props = {
  startPos: number;
  endPos: number;
  children?: ReactNode | null;
};

const TextWrapper = (props: Props) => {
  const { startPos, endPos } = props;
  const { children } = props;

  if (!children) {
    return null;
  }

  return (
    <TextWithAnnotationDraft startPos={startPos} endPos={endPos}>
      {children}
    </TextWithAnnotationDraft>
  );
};

export default TextWrapper;
