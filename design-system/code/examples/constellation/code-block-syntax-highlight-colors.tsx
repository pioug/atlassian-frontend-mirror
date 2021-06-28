import React, { useState } from 'react';

import Button from '@atlaskit/button';
import GlobalTheme from '@atlaskit/theme/components';
import type { ThemeModes } from '@atlaskit/theme/types';

import { CodeBlock } from '../../src';

const exampleCodeBlock = `interface Point {
  x: number;
  y: number;
}

function formatPoint(p: Point): string {
  let str = 'x:' + p.x;
  str += ', y:' + p.y;
  return str;
}

type Props = {
  message?: string;
  point: Point;
};

class PointLogger extends React.Component<Props> {
  formatMessage = (point: Point, message: string | undefined, ): string =>
    message
      ? message.replace(/(\{point\})/, formatPoint(point))
      : formatPoint(point);

  render() {
    const { message, point } = this.props;
    return <div id="point-logger">{this.formatMessage(point, message)}</div>;
  }
}

const coords = { x: 12, y: 26 };

ReactDOM.render(<PointLogger message="Position {point}" point={coords} />, mountNode);
`;

const CodeBlockHighlightColorsExample = () => {
  const [mode, setMode] = useState<ThemeModes>('light');

  return (
    <GlobalTheme.Provider value={() => ({ mode })}>
      <div>
        <Button
          appearance="primary"
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        >
          Toggle theme
        </Button>
      </div>
      <br />
      <CodeBlock language="tsx" text={exampleCodeBlock} />
    </GlobalTheme.Provider>
  );
};

export default CodeBlockHighlightColorsExample;
