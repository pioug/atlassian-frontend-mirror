import React from 'react';

import { cleanup, render } from '@testing-library/react';

import Code from '../../components/Code';
import ThemedCode from '../../ThemedCode';
import { defaultColors } from '../../themes/defaultTheme';

const jsCode = `const map = new Map({ key: 'value' })`;
const jsTestId = 'jstestid';

const javaCode = `public class HelloWorld
{
	public static void main(String[] args) {
		System.out.println("Hello World!");
	}
}`;

const pyCode = `def transform_data(data_frame, rolling_value):
rolling_df = pd.DataFrame(data_frame)
return rolling_df.rolling(rolling_value, min_periods=1, center=True).mean()`;

describe('Code', () => {
  const codeJavascript = (
    <Code text={jsCode} testId={jsTestId} language="javascript" />
  );
  const codeLanguageNotSupported = (
    <Code text={jsCode} testId="not-supported" language="dde" />
  );
  afterEach(cleanup);
  test('should render with language javascript', () => {
    const { getByTestId } = render(codeJavascript);
    expect(getByTestId(jsTestId)).toBeDefined();
    expect(getByTestId(jsTestId).getAttribute('data-code-lang')).toEqual(
      'javascript',
    );
  });
  test('should render with language that is not supported', () => {
    expect(
      render(codeLanguageNotSupported).getByTestId('not-supported'),
    ).toBeDefined();
  });

  describe('theming', () => {
    it('should apply theme bg color (dark)', () => {
      const { getByTestId } = render(
        <ThemedCode
          text={javaCode}
          language="java"
          testId="theme"
          theme={{ mode: 'dark' }}
        />,
      );
      expect(getByTestId('theme')).toHaveStyle(
        `background-color:
        ${defaultColors({ mode: 'dark' }).backgroundColor};`,
      );
    });

    it('should apply theme bg color', () => {
      const { getByTestId } = render(
        <ThemedCode text={javaCode} language="java" testId="theme" />,
      );
      expect(getByTestId('theme')).toHaveStyle(
        `background-color: ${
          defaultColors({ mode: 'light' }).backgroundColor
        };`,
      );
    });
  });

  test('should render a div instead of a span', () => {
    const { getByTestId } = render(
      <ThemedCode
        preTag="div"
        testId="python"
        text={pyCode}
        language="python"
      />,
    );

    expect(getByTestId('python').nodeName).toEqual('DIV');
  });
  test('should style code container with a red color', () => {
    const { container } = render(
      <ThemedCode
        preTag="div"
        codeTagProps={{ style: { color: 'red' } }}
        text={pyCode}
        language="python"
      />,
    );
    expect(container.querySelector('code')).toHaveStyle('color: red;');
  });
  test('should style numbers', () => {
    const { getByText } = render(
      <ThemedCode
        testId="test"
        codeStyle={{ number: { color: 'red' } }}
        text="x = 10 + 12"
        language="python"
      />,
    );
    expect(getByText('10')).toHaveStyle('number: red;');
    expect(getByText('12')).toHaveStyle('number: red;');
  });
});
