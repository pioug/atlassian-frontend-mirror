import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

/**
 * This rule is deprecated and the implementation has been changed so that it never reports.
 * As such these tests will fail. The only exist to demonstrate what the rule used to achieve.
 */
ruleTester.run('prefer-primitives', rule, {
	valid: [
		// it ignores React components
		'<Component />',

		// it ignores self-closing Box
		'<Box />',

		// it ignores empty Box
		'<Box></Box>',

		// it ignores empty Inline
		'<Inline></Inline>',

		// it ignores React components with the same name as a valid HTML element
		'<Section></Section>',

		// it ignores fragments
		'<></>',

		// it ignores elements with mixed JSX/non-JSX children
		'<div><Button>open</Button> dialog</div>',

		// it ignores already transformed code
		`
			const myI18nValue: string = "Close dialog";
			<Text>{myI18nValue}</Text>
		`,

		// it ignores non-JSX code
		'const x = 10;',

		// it ignores elements that aren't div or span
		'<a></a>',

		// it ignores elements that only contain text
		'<span> leading and trailing space </span>',

		// it ignores string values defined as inline object notation
		'<a>{"link"}</a>',

		// it ignores string values defined as variable object notation
		`
			const myI18nValue: string = "Close dialog";
			<p>{myI18nValue}</p>
		`,

		// it ignores styled calls extending components
		`styled(Button)\`color: red;\``,

		// it ignores styled calls extending elements that aren't div/span
		`styled('a')\`color: red;\``,

		// it ignores styled calls extending elements that aren't div/span
		`styled.a\`color: red;\``,

		// it ignores styled calls extending elements that aren't div/span
		`styled.a({ color: 'red' })`,
	],
	invalid: [
		// it suggests for div elements
		{
			code: '<div></div>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for span elements
		{
			code: '<span></span>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for button elements
		{
			code: '<button></button>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for article elements
		{
			code: '<article></article>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for aside elements
		{
			code: '<aside></aside>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for dialog elements
		{
			code: '<dialog></dialog>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for footer elements
		{
			code: '<footer></footer>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for header elements
		{
			code: '<header></header>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for li elements
		{
			code: '<li></li>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for main elements
		{
			code: '<main></main>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for nav elements
		{
			code: '<nav></nav>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for ol elements
		{
			code: '<ol></ol>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for section elements
		{
			code: '<section></section>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for ul elements
		{
			code: '<ul></ul>',
			errors: [{ messageId: 'preferPrimitives' }],
		},

		// it suggests for self closing tags
		{
			code: '<div />',
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests for self closing tags in Box
		{
			code: '<Box><div /></Box>',
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if the element only contains whitespace
		{
			code: '<span>  \n\n\t\t  \n\r  \t\t\t</span>',
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if div/span contains one JSX child
		{
			code: '<span><section>Section content</section></span>',
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if div/span contains more than one JSX element
		{
			code: `
			<span>
				<article>Some article</article>
				<article>Some other article</article>
			</span>
		`,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if the only child is a React.Fragment
		{
			code: outdent`
				<div>
					<>
						<something></something>
					</>
				</div>`,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// Suggests if div/span has attributes
		{
			code: outdent`
				<div
					data-testid="some-test-id"
					role="button"
					aria-live="polite"
					id="box-like"
				>
				</div>`,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if element has style attribute
		{
			code: `<div style={{ padding: "8px" }}></div>`,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if element has css attribute
		{
			code: `<div css={css({ padding: "8px" })}></div>`,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if element has css attribute with a variable reference
		{
			code: outdent`
				const someStyles = css({ color: token('atlassian.red', 'red') });
				<div css={someStyles}>{children}</div>`,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if element has class attribute
		{
			code: `<div class='container'></div>`,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if element has className attribute
		{
			code: `<div className='container'></div>`,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if element has multiple JSX children and appropriate styling
		{
			code: outdent`
				const flexStyles = css({ display: 'flex' });
				<div css={flexStyles}>
					<a href=\"/\">Home</a>
					<a href=\"/about\">About</a>
					<a href=\"/contact\">Contact</a>
				</div>`,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if element has nested styles
		{
			code: `
			const fakeStyles = css({
				width: '100%',
				height: '100%',
				'& > div': {
					display: 'flex',
					boxSizing: 'border-box',
				},
			});
			<div css={fakeStyles}>
				<Item>1</Item>
				<Item>2</Item>
			</div>
		`,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests for real world example: https://stash.atlassian.com/projects/JIRACLOUD/repos/jira-frontend/commits/50026a9169018b0a01c6ab71bfa72e01b5f2d8f1#src/packages/portfolio-3/portfolio/src/app-simple-plans/view/main/tabs/dependencies/issue/story.tsx?f=11
		{
			code: outdent`
				<div
					style={{
						display: 'flex',
						flexBasis: '100%',
						flexDirection: 'column',
						flexGrow: 1,
						maxWidth: '100%',
						minHeight: '100%',
					}}
				>
					<IssueExample position={{ x: 200, y: 100 }} itemId="10000" />
				</div>`,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if element used with styled components (member, template)
		{
			code: `styled.div\`color: 'red'\``,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if element used with styled components (member, object)
		{
			code: `styled.section({ color: 'green' })`,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if element used with styled components (call)
		{
			code: `styled('header')\`color: 'blue'\``,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},

		// it suggests if element used with compiled (member)
		{
			code: `styled2.nav\`color: 'red'\``,
			errors: [
				{
					messageId: 'preferPrimitives',
				},
			],
		},
	],
});
