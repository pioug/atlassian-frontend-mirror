import React from 'react';

interface Props {
  forceNewLine?: boolean;
}

const HardBreak: React.FunctionComponent<Props> = ({
  forceNewLine = false,
}) => {
  // To display an empty line using Shift+Enter, ProseMirror inserts a
  // double <br>. The second <br> is not part of the document, it's just
  // there to make browsers behave properly. The forceNewLine prop in this
  // component replicates this behaviour. If the last child node is a
  // hardBreak, it will also insert a double <br>.
  if (forceNewLine) {
    return (
      <>
        <br />
        <br />
      </>
    );
  }
  return <br />;
};

export default HardBreak;
