/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
// disable these two rules, there is no good way to query node without querySelector
/* eslint-disable testing-library/no-container,testing-library/no-node-access */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type CSSObject, jsx } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import refractor from 'refractor';

import Highlight from '../../async';
import { type SyntaxHighlighterProps } from '../../types';

// code string examples
const javaCodeLine = 'int num = 21';
const javaCodeBlock = `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`;
const oneLineJavaCodeBlock = `public class Main { public static void main(String[] args) { System.out.println("Hello World");}}`;
const javaCodeBlockWithBidiChar = 'int num = 21‮';

// props
const props: SyntaxHighlighterProps = {
	language: 'java',
	children: [],
	lineProps: {},
	showLineNumbers: true,
	shouldCreateParentElementForLines: false,
	shouldWrapLongLines: false,
	codeBidiWarnings: false,
	codeBidiWarningTooltipEnabled: false,
};

// style example
const style = {
	'code[class*="language-"]': {
		lineHeight: '2',
	},
	'code[class*="language-java"]': {
		fontWeight: 'bold',
	},
} as CSSObject;

// spy
const refractorSpy = jest.spyOn(refractor, 'highlight');

describe('Highlight', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render unhighlighted code and not call refractor if language is not set', () => {
		const highlight = <Highlight {...props} language={undefined} text={javaCodeLine} />;
		render(highlight);

		expect(refractorSpy).not.toBeCalled();
		expect(screen.getByText(javaCodeLine)).toBeInTheDocument();
	});

	it('should render unhighlighted code if language is not valid', () => {
		const highlight = (
			<Highlight {...props} language="unexistingLanguage" text={javaCodeLine}>
				{javaCodeLine}
			</Highlight>
		);
		render(highlight);

		expect(screen.getByText(javaCodeLine)).toBeInTheDocument();
		expect(refractorSpy).toBeCalled();
		expect(refractorSpy).toThrow();
	});

	it('should render highlighted code if valid language is set', () => {
		const highlight = <Highlight {...props} language="java" text={javaCodeLine} />;
		const { container } = render(highlight);

		expect(screen.getByText('int')).toBeInTheDocument();
		expect(screen.getByText('num')).toBeInTheDocument();
		expect(screen.getByText('=')).toBeInTheDocument();
		expect(screen.getByText('21')).toBeInTheDocument();
		expect(refractorSpy).toBeCalledTimes(1);
		expect(container.querySelector('code')).toBeInTheDocument();
	});

	it('should use language prop as part of the code element className', () => {
		const highlight = <Highlight {...props} language="java" text={javaCodeLine} />;
		const { container } = render(highlight);
		const code = container.querySelector('code');

		expect(code).toBeInTheDocument();
		expect(code).toHaveClass('language-java');
	});

	it('should render correct number of tokens', () => {
		const highlightLine = <Highlight {...props} showLineNumbers={true} text={javaCodeLine} />;
		const highlightBlock = <Highlight {...props} showLineNumbers={true} text={javaCodeBlock} />;
		const { container: highlightLineContainer } = render(highlightLine);
		const { container: highlightBlockContainer } = render(highlightBlock);

		expect(highlightLineContainer.getElementsByClassName('token')).toHaveLength(3);
		expect(highlightBlockContainer.getElementsByClassName('token')).toHaveLength(24);
	});

	it('should render line number element if showLineNumbers flag is set to true', () => {
		const highlight = <Highlight {...props} showLineNumbers={true} text={javaCodeLine} />;
		const { container } = render(highlight);
		const lineNumbers = container.getElementsByClassName('linenumber');

		expect(lineNumbers.length).toBe(1);
		expect(lineNumbers[0]).toHaveAttribute('data-ds--line-number', '1');
	});

	it('should render line numbers for each code line', () => {
		const highlight = <Highlight {...props} showLineNumbers={true} text={javaCodeBlock} />;
		const { container } = render(highlight);
		const lineNumbers = container.getElementsByClassName('linenumber');

		expect(lineNumbers.length).toBe(5);
		expect(lineNumbers[4]).toHaveAttribute('data-ds--line-number', '5');
	});

	it('should not render line number element if showLineNumbers flag is set to false', () => {
		const highlight = <Highlight {...props} showLineNumbers={false} text={javaCodeLine} />;
		const { container } = render(highlight);
		const lineNumbers = container.getElementsByClassName('linenumber');

		expect(lineNumbers.length).toBe(0);
	});

	it('should break code by multiple lines if shouldWrapLongLines flag is set to true', () => {
		const highlight = (
			<Highlight {...props} shouldWrapLongLines={true} text={oneLineJavaCodeBlock} />
		);
		const { container } = render(highlight);
		const lineNumbers = container.getElementsByClassName('linenumber');
		const code = container.querySelector('code');

		expect(code).toHaveStyle('white-space: pre-wrap');
		expect(code).toHaveStyle('word-break: break-word');
		expect(lineNumbers.length).toBe(1);
		expect(code?.children).toHaveLength(1);
	});

	it('should not break code by multiple lines if shouldWrapLongLines flag is set to false', () => {
		const highlight = (
			<Highlight {...props} shouldWrapLongLines={false} text={oneLineJavaCodeBlock} />
		);
		const { container } = render(highlight);
		const code = container.querySelector('code');

		expect(code).toHaveStyle('white-space: pre');
		expect(code).not.toHaveStyle('word-break: break-word');
		expect(code?.children).toHaveLength(36);
	});

	it('should render a bidi code warning if codeBidiWarnings flag is set to true', () => {
		const highlight = (
			<Highlight {...props} codeBidiWarnings={true} text={javaCodeBlockWithBidiChar} />
		);
		render(highlight);

		expect(screen.getByText('U+202e')).toBeInTheDocument();
	});

	it('should not render a bidi code warning if codeBidiWarnings flag is set to false', () => {
		const highlight = (
			<Highlight {...props} codeBidiWarnings={false} text={javaCodeBlockWithBidiChar} />
		);
		render(highlight);

		expect(screen.queryByLabelText('U+202e')).not.toBeInTheDocument();
	});

	it('should render a bidi code warning with a tooltip if codeBidiWarningTooltipEnabled flag is set to true', () => {
		const highlight = (
			<Highlight
				{...props}
				codeBidiWarnings={true}
				codeBidiWarningTooltipEnabled={true}
				text={javaCodeBlockWithBidiChar}
			/>
		);
		render(highlight);

		expect(screen.getByRole('presentation')).toBeInTheDocument();
	});

	it('should not render a bidi code warning tooltip if codeBidiWarningTooltipEnabled flag is set to false', () => {
		const highlight = (
			<Highlight
				{...props}
				codeBidiWarnings={true}
				codeBidiWarningTooltipEnabled={false}
				text={javaCodeBlockWithBidiChar}
			/>
		);
		render(highlight);

		expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
	});

	it('should apply passed styles and class names', () => {
		const highlight = (
			<Highlight
				{...props}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="testClassName"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				css={css(style)}
				text={javaCodeLine}
			/>
		);
		const { container } = render(highlight);
		const wrapper = container.querySelector('span');
		const code = container.querySelector('code');

		expect(wrapper).toHaveClass('testClassName');
		expect(code).toHaveStyle('line-height: 2');
		expect(code).toHaveStyle('font-weight: bold');
	});

	it('should apply lineProps if shouldCreateParentElementForLines is true', () => {
		const lineProps = {
			'data-testid': 'testId',
		};
		const highlight = (
			<Highlight
				{...props}
				lineProps={lineProps}
				shouldCreateParentElementForLines={true}
				text={javaCodeLine}
			/>
		);
		render(highlight);

		expect(screen.getByTestId('testId')).toBeInTheDocument();
	});

	it('should apply lineProps passing lineNumber as an argument if lineProps is a function', () => {
		const getLineProps = (lineNumber: number) => ({
			'data-testid': `testId-${lineNumber}`,
		});
		const highlight = (
			<Highlight
				{...props}
				lineProps={getLineProps}
				shouldCreateParentElementForLines={true}
				text={javaCodeLine}
			/>
		);
		render(highlight);

		expect(screen.getByTestId('testId-1')).toBeInTheDocument();
	});
});
