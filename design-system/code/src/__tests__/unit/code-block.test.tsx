// disable these two rules, there is no good way to query node without querySelector
/* eslint-disable testing-library/no-container,testing-library/no-node-access */
import React from 'react';

import { render, screen } from '@testing-library/react';

import { token } from '@atlaskit/tokens';

import CodeBlock from '../../code-block';
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
	const findCodeLine = (line: number): HTMLElement => {
		return screen.getByTestId(`${testId}-line-${line}`);
	};

	it('should have "text" as the default language', () => {
		const { container } = render(<CodeBlock text={code} />);
		expect(container.querySelector('[data-code-lang="text"]')).not.toBeNull();
	});

	it('should have "showLineNumbers" enabled by default', () => {
		const { container } = render(<CodeBlock text={code} />);
		expect(container.querySelector('.linenumber')).not.toBeNull();
	});

	it('should have "firstLineNumber" equal 1 by default', () => {
		const { container } = render(<CodeBlock text={code} />);
		expect(
			container
				.querySelector('.linenumber[data-ds--line-number]')
				?.getAttribute('data-ds--line-number'),
		).toEqual('1');
	});

	// skipping this test as it does not work with jsdom.reconfigure. Need to rewrite this test.
	// https://hello.jira.atlassian.cloud/browse/UTEST-2000
	it.skip('should apply correct bg color', () => {
		render(<CodeBlock text={code} testId="test" language="java" />);
		expect(screen.getByTestId('test')).toHaveStyle(
			`background-color: ${token('color.background.neutral')};`,
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
		expect(container.querySelectorAll('.linenumber')).toHaveLength(longCode.split('\n').length);
	});

	it('should render the right thing on the right line', () => {
		render(<CodeBlock text={longCode} testId={testId} />);

		longCode.split('\n').forEach((line, index) => {
			const lineNum = index + 1;
			expect(findCodeLine(lineNum).textContent?.trim()).toEqual(line);
		});
	});

	it('should render the right thing on the right line when firstLineNumber is set', () => {
		render(<CodeBlock text={longCode} testId={testId} firstLineNumber={333} />);

		longCode.split('\n').forEach((line, index) => {
			const lineNum = index + 333;
			expect(findCodeLine(lineNum).textContent?.trim()).toEqual(line);
		});
	});

	describe('Highlighting lines works as expected', () => {
		it(`should render single line highlight`, () => {
			const { container } = render(<CodeBlock text={longCode} testId={testId} highlight="1" />);

			expect(findCodeLine(1)).toHaveAttribute('data-ds--code--row--highlight');
			expect(findCodeLine(2)).not.toHaveAttribute('data-ds--code--row--highlight');
			expect(container.querySelectorAll('[data-ds--code--row--highlight]')).toHaveLength(1);
		});

		it(`should render highlight for a range of lines`, () => {
			const { container } = render(<CodeBlock text={longCode} testId={testId} highlight="1-3" />);

			[1, 2, 3].forEach((lineNumber) =>
				expect(findCodeLine(lineNumber)).toHaveAttribute('data-ds--code--row--highlight'),
			);
			expect(findCodeLine(4)).not.toHaveAttribute('data-ds--code--row--highlight');
			expect(container.querySelectorAll('[data-ds--code--row--highlight]')).toHaveLength(3);
		});

		it(`should render highlight for a combination of single and ranges`, () => {
			const { container } = render(
				<CodeBlock text={longCode} testId={testId} highlight="1-3,5,8-9" />,
			);

			[1, 2, 3].forEach((lineNumber) =>
				expect(findCodeLine(lineNumber)).toHaveAttribute('data-ds--code--row--highlight'),
			);
			[4, 6, 10].forEach((lineNumber) =>
				expect(findCodeLine(lineNumber)).not.toHaveAttribute('data-ds--code--row--highlight'),
			);
			expect(container.querySelectorAll('[data-ds--code--row--highlight]')).toHaveLength(6);
		});
	});

	describe('Tokenised class names are rendered correctly', () => {
		it('should handle multiple combinations of up to 4 token classes', () => {
			render(
				<CodeBlock text="console.log('hi')" testId={testId} language="ts" showLineNumbers={true} />,
			);

			expect(screen.getByText('console')).toHaveClass('token console class-name');
			expect(screen.getByText('.')).toHaveClass('token punctuation');
			expect(screen.getByText('log')).toHaveClass('token method function property-access');
		});
	});
});
