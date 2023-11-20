import React from 'react';

import { cleanup, render } from '@testing-library/react';

import CodeBlock from '../../code-block';
import { getColorPalette } from '../../internal/theme/get-theme';
import { getLineNumWidth } from '../../internal/theme/styles';

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
    const { container } = render(<CodeBlock text={code} />);
    expect(container.querySelector('[data-code-lang="text"]')).not.toBeNull();
  });

  it('should have "showLineNumbers" enabled by default', () => {
    const { container } = render(<CodeBlock text={code} />);
    expect(container.querySelector('.linenumber')).not.toBeNull();
  });

  it('should apply correct bg color', () => {
    const { getByTestId } = render(
      <CodeBlock text={code} testId="test" language="java" />,
    );
    expect(getByTestId('test')).toHaveStyle(
      `background-color: ${getColorPalette().backgroundColor};`,
    );
  });

  describe('LineNumber col size expands as expected', () => {
    it(`should return 1ch if no value provided`, () => {
      expect(getLineNumWidth(undefined as any)).toEqual('1ch');
    });

    [1, 10, 100, 1000, 10000, 100000].forEach((val) => {
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
      expect(findCodeLine(rendered, lineNum).textContent?.trim()).toEqual(line);
    });
  });

  describe('Highlighting lines works as expected', () => {
    it(`should render single line highlight`, () => {
      const renderResult = render(
        <CodeBlock text={longCode} testId={testId} highlight="1" />,
      );
      const { container } = renderResult;

      expect(findCodeLine(renderResult, 1)).toHaveAttribute(
        'data-ds--code--row--highlight',
      );
      expect(findCodeLine(renderResult, 2)).not.toHaveAttribute(
        'data-ds--code--row--highlight',
      );
      expect(
        container.querySelectorAll('[data-ds--code--row--highlight]'),
      ).toHaveLength(1);
    });

    it(`should render highlight for a range of lines`, () => {
      const renderResult = render(
        <CodeBlock text={longCode} testId={testId} highlight="1-3" />,
      );
      const { container } = renderResult;

      [1, 2, 3].forEach((lineNumber) =>
        expect(findCodeLine(renderResult, lineNumber)).toHaveAttribute(
          'data-ds--code--row--highlight',
        ),
      );
      expect(findCodeLine(renderResult, 4)).not.toHaveAttribute(
        'data-ds--code--row--highlight',
      );
      expect(
        container.querySelectorAll('[data-ds--code--row--highlight]'),
      ).toHaveLength(3);
    });

    it(`should render highlight for a combination of single and ranges`, () => {
      const renderResult = render(
        <CodeBlock text={longCode} testId={testId} highlight="1-3,5,8-9" />,
      );
      const { container } = renderResult;

      [1, 2, 3].forEach((lineNumber) =>
        expect(findCodeLine(renderResult, lineNumber)).toHaveAttribute(
          'data-ds--code--row--highlight',
        ),
      );
      [4, 6, 10].forEach((lineNumber) =>
        expect(findCodeLine(renderResult, lineNumber)).not.toHaveAttribute(
          'data-ds--code--row--highlight',
        ),
      );
      expect(
        container.querySelectorAll('[data-ds--code--row--highlight]'),
      ).toHaveLength(6);
    });
  });

  describe('Tokenised class names are rendered correctly', () => {
    it('should handle multiple combinations of up to 4 token classes', () => {
      const { getByText } = render(
        <CodeBlock
          text="console.log('hi')"
          testId={testId}
          language="ts"
          showLineNumbers={true}
        />,
      );

      expect(getByText('console')).toHaveClass('token console class-name');
      expect(getByText('.')).toHaveClass('token punctuation');
      expect(getByText('log')).toHaveClass(
        'token method function property-access',
      );
    });
  });
});
