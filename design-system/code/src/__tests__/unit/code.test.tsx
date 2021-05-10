import React from 'react';

import { cleanup, render } from '@testing-library/react';

import GlobalTheme from '@atlaskit/theme/components';

import Code from '../../code';
import { getColorPalette } from '../../internal/theme/get-theme';

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
  const codeJavascript = <Code testId={jsTestId}>{jsCode}</Code>;
  const jsxInCode = (
    <Code testId="jsx">
      {jsCode} <div data-testid="valid">valid</div>
    </Code>
  );
  afterEach(cleanup);
  it('base case should render', () => {
    const { getByTestId } = render(codeJavascript);
    expect(getByTestId(jsTestId)).toBeDefined();
  });
  it('should render with jsx ', () => {
    const { getByTestId } = render(jsxInCode);
    expect(getByTestId('jsx')).toBeDefined();
    expect(getByTestId('valid').textContent === 'valid');
  });

  describe('theming', () => {
    it('should apply theme bg color (dark)', () => {
      const { getByTestId } = render(
        <GlobalTheme.Provider value={() => ({ mode: 'dark' })}>
          <Code testId="theme">{javaCode}</Code>
        </GlobalTheme.Provider>,
      );
      expect(getByTestId('theme')).toHaveStyle(
        `background-color:
        ${getColorPalette({ mode: 'dark' }).backgroundColor};`,
      );
    });

    it('should fallback to default theme bg color', () => {
      const { getByTestId } = render(<Code testId="theme">{javaCode}</Code>);
      expect(getByTestId('theme')).toHaveStyle(
        `background-color: ${
          getColorPalette({ mode: 'light' }).backgroundColor
        };`,
      );
    });
  });

  it('should style code container with a red color', () => {
    const { getByTestId } = render(
      <Code testId="style-property" style={{ color: 'red' }}>
        {pyCode}
      </Code>,
    );
    expect(getByTestId('style-property')).toHaveStyle('color: red;');
  });
});
