import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('use-heading', rule, {
	valid: [
		// ignores divs
		'<div><div></div></div>',
		'<div><div /></div>',
		// ignore heading elements with no children
		'<div><h1></h1></div>',
		'<div><h1 /></div>',
		'<div><h2></h2></div>',
		'<div><h2 /></div>',
		'<div><h3></h3></div>',
		'<div><h3 /></div>',
		'<div><h4></h4></div>',
		'<div><h4 /></div>',
		'<div><h5></h5></div>',
		'<div><h5 /></div>',
		'<div><h6></h6></div>',
		'<div><h6 /></div>',
		// ignores headings that are the root element
		`
		<h1>text 1</h1>
		`,
		// ignores headings that are not the first element
		`
			<div>
				<p>text 1</p>
				{children}
				<h1>text 2</h1>
			</div>
		`,
		`
			<div>
				<p>text 1</p>
				<h1>text 2</h1>
			</div>
		`,
	],
	invalid: [
		// No sibling elements
		{
			code: outdent`
				<div>
					<h2>content</h2>
				</div>`,
			errors: [
				{
					messageId: 'preferHeading',
					suggestions: [
						{
							desc: `Convert to Heading`,
							output: outdent`
								import Heading from '@atlaskit/heading';
								<div>
									<Heading size='large'>content</Heading>
								</div>
							`,
						},
					],
				},
			],
		},
		// Sibling elements after the current element
		{
			code: outdent`
			<div>
				<h2>content</h2>
				<span>content</span>
			</div>`,
			errors: [
				{
					messageId: 'preferHeading',
					suggestions: [
						{
							desc: `Convert to Heading`,
							output: outdent`
							import Heading from '@atlaskit/heading';
							<div>
								<Heading size='large'>content</Heading>
								<span>content</span>
							</div>
							`,
						},
					],
				},
			],
		},
		// All 6 heading elements
		{
			code: outdent`
				import Heading from '@atlaskit/heading';
				<div>
					<div><h1>heading 1</h1></div>
					<div><h2>heading 2</h2></div>
					<div><h3>heading 3</h3></div>
					<div><h4>heading 4</h4></div>
					<div><h5>heading 5</h5></div>
					<div><h6>heading 6</h6></div>
				</div>
				`,
			errors: [
				{
					messageId: 'preferHeading',
					suggestions: [
						{
							desc: `Convert to Heading`,
							output: outdent`
								import Heading from '@atlaskit/heading';
								<div>
									<div><Heading size='xlarge'>heading 1</Heading></div>
									<div><h2>heading 2</h2></div>
									<div><h3>heading 3</h3></div>
									<div><h4>heading 4</h4></div>
									<div><h5>heading 5</h5></div>
									<div><h6>heading 6</h6></div>
								</div>
							`,
						},
					],
				},
				{
					messageId: 'preferHeading',
					suggestions: [
						{
							desc: `Convert to Heading`,
							output: outdent`
								import Heading from '@atlaskit/heading';
								<div>
									<div><h1>heading 1</h1></div>
									<div><Heading size='large'>heading 2</Heading></div>
									<div><h3>heading 3</h3></div>
									<div><h4>heading 4</h4></div>
									<div><h5>heading 5</h5></div>
									<div><h6>heading 6</h6></div>
								</div>`,
						},
					],
				},
				{
					messageId: 'preferHeading',
					suggestions: [
						{
							desc: `Convert to Heading`,
							output: outdent`
								import Heading from '@atlaskit/heading';
								<div>
									<div><h1>heading 1</h1></div>
									<div><h2>heading 2</h2></div>
									<div><Heading size='medium'>heading 3</Heading></div>
									<div><h4>heading 4</h4></div>
									<div><h5>heading 5</h5></div>
									<div><h6>heading 6</h6></div>
								</div>`,
						},
					],
				},
				{
					messageId: 'preferHeading',
					suggestions: [
						{
							desc: `Convert to Heading`,
							output: outdent`
								import Heading from '@atlaskit/heading';
								<div>
									<div><h1>heading 1</h1></div>
									<div><h2>heading 2</h2></div>
									<div><h3>heading 3</h3></div>
									<div><Heading size='small'>heading 4</Heading></div>
									<div><h5>heading 5</h5></div>
									<div><h6>heading 6</h6></div>
								</div>`,
						},
					],
				},
				{
					messageId: 'preferHeading',
					suggestions: [
						{
							desc: `Convert to Heading`,
							output: outdent`
								import Heading from '@atlaskit/heading';
								<div>
									<div><h1>heading 1</h1></div>
									<div><h2>heading 2</h2></div>
									<div><h3>heading 3</h3></div>
									<div><h4>heading 4</h4></div>
									<div><Heading size='xsmall'>heading 5</Heading></div>
									<div><h6>heading 6</h6></div>
								</div>`,
						},
					],
				},
				{
					messageId: 'preferHeading',
					suggestions: [
						{
							desc: `Convert to Heading`,
							output: outdent`
								import Heading from '@atlaskit/heading';
								<div>
									<div><h1>heading 1</h1></div>
									<div><h2>heading 2</h2></div>
									<div><h3>heading 3</h3></div>
									<div><h4>heading 4</h4></div>
									<div><h5>heading 5</h5></div>
									<div><Heading size='xxsmall'>heading 6</Heading></div>
								</div>`,
						},
					],
				},
			],
		},
		// Heading module already imported
		{
			code: outdent`
				import Heading from '@atlaskit/heading';
				<div>
					<h2>content</h2>
					<Heading>content</Heading>
				</div>
			`,
			errors: [
				{
					messageId: 'preferHeading',
					suggestions: [
						{
							desc: `Convert to Heading`,
							output: outdent`
								import Heading from '@atlaskit/heading';
								<div>
									<Heading size='large'>content</Heading>
									<Heading>content</Heading>
								</div>
							`,
						},
					],
				},
			],
		},
		// JSXFragments as parent element
		{
			code: outdent`
				<>
					<h2>content</h2>
					<Heading>content</Heading>
				</>`,
			errors: [
				{
					messageId: 'preferHeading',
					suggestions: [
						{
							desc: `Convert to Heading`,
							output: outdent`
								import Heading from '@atlaskit/heading';
								<>
									<Heading size='large'>content</Heading>
									<Heading>content</Heading>
								</>
							`,
						},
					],
				},
			],
		},
		// Errors and applies auto fixes when option is enabled
		{
			options: [{ enableUnsafeAutofix: true }],
			code: outdent`
				import Heading from '@atlaskit/heading';
				<div>
					<div><h1>heading 1</h1></div>
					<div><h2>heading 2</h2></div>
					<div><h3>heading 3</h3></div>
					<div><h4>heading 4</h4></div>
					<div><h5>heading 5</h5></div>
					<div><h6>heading 6</h6></div>
				</div>
				`,
			errors: [
				{ messageId: 'preferHeading' },
				{ messageId: 'preferHeading' },
				{ messageId: 'preferHeading' },
				{ messageId: 'preferHeading' },
				{ messageId: 'preferHeading' },
				{ messageId: 'preferHeading' },
			],
			output: outdent`
				import Heading from '@atlaskit/heading';
				<div>
					<div><Heading size='xlarge'>heading 1</Heading></div>
					<div><Heading size='large'>heading 2</Heading></div>
					<div><Heading size='medium'>heading 3</Heading></div>
					<div><Heading size='small'>heading 4</Heading></div>
					<div><Heading size='xsmall'>heading 5</Heading></div>
					<div><Heading size='xxsmall'>heading 6</Heading></div>
				</div>`,
		},
		// Report all elements when unsafe report option is enabled
		{
			options: [{ enableUnsafeReport: true }],
			code: '<h1>text 1</h1>',
			errors: [{ messageId: 'preferHeading' }],
		},
		{
			options: [{ enableUnsafeReport: true }],
			code: outdent`
				import Heading from '@atlaskit/heading';
				<div>
					<h1>heading 1</h1>
					<h2>heading 2</h2>
					<h3>heading 3</h3>
					<h4>heading 4</h4>
					<h5>heading 5</h5>
					<h6>heading 6</h6>
				</div>`,
			errors: [
				{ messageId: 'preferHeading' },
				{ messageId: 'preferHeading' },
				{ messageId: 'preferHeading' },
				{ messageId: 'preferHeading' },
				{ messageId: 'preferHeading' },
				{ messageId: 'preferHeading' },
			],
		},
		{
			options: [{ enableUnsafeReport: true }],
			code: outdent`
				import Heading from '@atlaskit/heading';
				<div>
					<p>text 1</p>
					{children}
					<h1>text 2</h1>
				</div>`,
			errors: [{ messageId: 'preferHeading' }],
		},
	],
});
