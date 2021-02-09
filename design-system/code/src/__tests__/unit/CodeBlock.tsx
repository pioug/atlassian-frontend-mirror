import React from 'react';

import { cleanup, render } from '@testing-library/react';

import CodeBlock from '../../components/CodeBlock';
import ThemedCodeBlock from '../../ThemedCodeBlock';
import { defaultColors } from '../../themes/defaultTheme';
import { getLineNumWidth } from '../../themes/themeBuilder';

const code = `// some code
const a = 'foo';
const b = 'bar';
const c = [a, b].map(item => item + item);
const d = 'hello-world';
`;

const longCode = `// some code
// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
// 10
// 11
`;

const darkTheme = { mode: 'dark' };
const testId = 'code-test';

describe('CodeBlock', () => {
  afterEach(cleanup);

  const findCodeLine = (
    rendered: ReturnType<typeof render>,
    line: number,
  ): HTMLElement => {
    return rendered.getByTestId(`${testId}-line-${line}`);
  };

  it('should have "text" as the default language', () => {
    const { container } = render(<ThemedCodeBlock text={code} />);
    expect(container.querySelector('[data-code-lang="text"]')).not.toBeNull();
  });

  it('should have "showLineNumbers" enabled by default', () => {
    const { container } = render(<ThemedCodeBlock text={code} />);
    expect(container.querySelector('.linenumber')).not.toBeNull();
  });

  describe('theming', () => {
    it('should apply theme bg color (dark)', () => {
      const { container } = render(
        <ThemedCodeBlock text={code} language="java" theme={darkTheme} />,
      );
      expect(container.querySelector('[data-code-block] > span')).toHaveStyle(
        `background-color:
        ${defaultColors(darkTheme).backgroundColor};`,
      );
    });

    it('should apply theme bg color', () => {
      const { container } = render(
        <ThemedCodeBlock text={code} language="java" />,
      );
      expect(container.querySelector('[data-code-block] > span')).toHaveStyle(
        `background-color: ${
          defaultColors({ mode: 'light' }).backgroundColor
        };`,
      );
    });
  });

  describe('LineNumber col size expands as expected', () => {
    it(`should return 1ch if no value provided`, () => {
      expect(getLineNumWidth(undefined as any)).toEqual('1ch');
    });

    [1, 10, 100, 1000, 10000, 100000].forEach(val => {
      it(`should return ${val.toFixed(0).length}ch for (${val})`, () => {
        expect(getLineNumWidth(val)).toEqual(`${val.toFixed(0).length}ch`);
      });
    });
  });

  it(`should render ${longCode.split('\n').length} lines`, () => {
    const { container } = render(<CodeBlock text={longCode} testId={testId} />);
    expect(container.querySelectorAll('.linenumber')).toHaveLength(
      longCode.split('\n').length,
    );
  });

  it('should render the right thing on the right line', () => {
    const rendered = render(<CodeBlock text={longCode} testId={testId} />);

    longCode.split('\n').forEach((line, index) => {
      const lineNum = index + 1;
      expect(findCodeLine(rendered, lineNum).textContent?.trim()).toEqual(
        lineNum + line,
      );
    });
  });
});
