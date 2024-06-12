import React from 'react';

import { cleanup, render } from '@testing-library/react';

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
		expect(getByTestId(jsTestId)).toBeInTheDocument();
	});
	it('should render with jsx ', () => {
		const { getByTestId } = render(jsxInCode);
		expect(getByTestId('jsx')).toBeInTheDocument();
		expect(getByTestId('valid').textContent === 'valid');
	});

	it('should have the correct bg color', () => {
		const { getByTestId } = render(<Code testId="bg">{javaCode}</Code>);
		expect(getByTestId('bg')).toHaveStyle(
			`background-color: ${getColorPalette().backgroundColor};`,
		);
	});

	it('should style code container with a red color', () => {
		const { getByTestId } = render(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<Code testId="style-property" style={{ color: 'red' }}>
				{pyCode}
			</Code>,
		);
		expect(getByTestId('style-property')).toHaveStyle('color: red;');
	});
});
