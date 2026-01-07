import React from 'react';

import { render, screen } from '@testing-library/react';

import { token } from '@atlaskit/tokens';

import Code from '../../code';

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

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Code', () => {
	const codeJavascript = <Code testId={jsTestId}>{jsCode}</Code>;
	const jsxInCode = (
		<Code testId="jsx">
			{jsCode} <div data-testid="valid">valid</div>
		</Code>
	);
	it('base case should render', () => {
		render(codeJavascript);
		expect(screen.getByTestId(jsTestId)).toBeInTheDocument();
	});
	it('should render with jsx ', () => {
		render(jsxInCode);
		expect(screen.getByTestId('jsx')).toBeInTheDocument();
		expect(screen.getByTestId('valid').textContent === 'valid');
	});

	// skipping this test as it does not work with jsdom.reconfigure. Need to rewrite this test.
	// https://hello.jira.atlassian.cloud/browse/UTEST-2000
	it.skip('should have the correct bg color', () => {
		render(<Code testId="bg">{javaCode}</Code>);
		expect(screen.getByTestId('bg')).toHaveStyle(
			`background-color: ${token('color.background.neutral')};`,
		);
	});

	// skipping this test as it does not work with jsdom.reconfigure. Need to rewrite this test.
	// https://hello.jira.atlassian.cloud/browse/UTEST-2000
	it.skip('should style code container with a red color', () => {
		render(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<Code testId="style-property" style={{ color: 'red' }}>
				{pyCode}
			</Code>,
		);
		expect(screen.getByTestId('style-property')).toHaveStyle('color: red;');
	});
});
