import { formatComponent } from '../output/format-component';
import { formatDisambiguation } from '../output/format-disambiguation';
import { formatDocObject } from '../output/format-doc-object';
import { formatIcon } from '../output/format-icon';
import { formatLintRules } from '../output/format-lint-rules';
import { formatToken } from '../output/format-token';

describe('formatComponent', () => {
	it('renders a header, props, and examples for a single-element array payload', () => {
		const out = formatComponent([
			{
				name: 'Button',
				package: '@atlaskit/button',
				props: [{ name: 'appearance', type: '"default" | "primary"', description: 'The style.' }],
				examples: ['<Button>Go</Button>'],
			},
		]);
		expect(out).not.toBeNull();
		expect(out).toContain('Button  (@atlaskit/button)');
		expect(out).toContain('Props (1):');
		expect(out).toContain('appearance');
		expect(out).toContain('The style.');
		expect(out).toContain('Examples (1):');
		expect(out).toContain('<Button>Go</Button>');
		// Must not be a raw JSON dump.
		expect(out).not.toContain('"package"');
	});

	it('accepts a bare object payload (not wrapped in an array)', () => {
		const out = formatComponent({
			name: 'Avatar',
			package: '@atlaskit/avatar',
			props: [],
			examples: [],
		});
		expect(out).toContain('Avatar  (@atlaskit/avatar)');
		expect(out).toContain('Props: none');
	});

	it('renders the Figma link from designSource.figmaUrl (not the raw object)', () => {
		// Regression guard: `designSource` is an object `{ figmaUrl }`, not a string. Interpolating
		// the object directly rendered `Design: [object Object]`.
		const out = formatComponent({
			name: 'Button',
			package: '@atlaskit/button',
			props: [],
			examples: [],
			designSource: { figmaUrl: 'https://example.com/figma' },
		});
		expect(out).toContain('Design: https://example.com/figma');
		expect(out).not.toContain('[object Object]');
	});

	it('omits the Design line when designSource has no figmaUrl', () => {
		const out = formatComponent({
			name: 'Button',
			package: '@atlaskit/button',
			props: [],
			examples: [],
			designSource: {},
		});
		expect(out).not.toContain('Design:');
	});

	it('returns null for a non-component payload so the caller can fall back', () => {
		expect(formatComponent('just a string')).toBeNull();
		expect(formatComponent([{ notAComponent: true }])).toBeNull();
		expect(formatComponent(null)).toBeNull();
	});
});

describe('formatDocObject', () => {
	it('renders title, description, and labelled lists', () => {
		const out = formatDocObject({
			topic: 'buttons',
			title: 'Button Accessibility',
			description: 'How to make buttons accessible.',
			guidelines: ['Provide labels', 'Support keyboard'],
			bestPractices: ['Use the Button component'],
		});
		expect(out).not.toBeNull();
		expect(out).toContain('Button Accessibility');
		expect(out).toContain('How to make buttons accessible.');
		expect(out).toContain('Guidelines:');
		expect(out).toContain('  - Provide labels');
		expect(out).toContain('Best Practices:');
		// Identity field must not become its own section.
		expect(out).not.toContain('Topic:');
	});

	it('renders code-example objects as titled fenced blocks', () => {
		const out = formatDocObject({
			title: 'Guide',
			codeExamples: [{ title: 'Accessible Button', code: '<Button aria-label="x" />' }],
		});
		expect(out).toContain('  - Accessible Button');
		expect(out).toContain('```tsx');
		expect(out).toContain('<Button aria-label="x" />');
	});

	it('renders the topic-index shape (no title, uses `message` as header)', () => {
		// `docs a11y` with no topic returns this shape instead of a full guide.
		const out = formatDocObject({
			availableTopics: ['buttons', 'forms'],
			message: 'Specify a topic to get detailed guidelines.',
			guidelines: ['General guideline'],
		});
		expect(out).not.toBeNull();
		expect(out).toContain('Specify a topic to get detailed guidelines.');
		expect(out).toContain('Available Topics:');
		expect(out).toContain('  - buttons');
	});

	it('returns null when there is neither a title nor a message (defers to generic)', () => {
		expect(formatDocObject({ foo: 'bar' })).toBeNull();
		expect(formatDocObject('a markdown string')).toBeNull();
		expect(formatDocObject(['an', 'array'])).toBeNull();
	});
});

describe('formatLintRules', () => {
	it('prints each rule’s markdown content, joined by a divider', () => {
		const out = formatLintRules([
			{ ruleName: 'a', content: '# Rule A\n\nBody A.' },
			{ ruleName: 'b', content: '# Rule B\n\nBody B.' },
		]);
		expect(out).toContain('# Rule A');
		expect(out).toContain('# Rule B');
		expect(out).toContain('---');
	});

	it('parses the double-encoded single-rule string form', () => {
		// The tool returns a JSON string literal for a single match; the generic unwrap yields a
		// string that still looks like JSON. The formatter must parse that second layer.
		const doubleEncoded = JSON.stringify({ ruleName: 'x', content: '# Rule X\n\nBody.' });
		const out = formatLintRules(doubleEncoded);
		expect(out).toContain('# Rule X');
		expect(out).toContain('Body.');
	});

	it('parses the double-encoded multi-rule array form', () => {
		// For multiple matches (e.g. bare `lint-rules`, or several terms) the tool returns an array
		// whose elements are each a JSON string literal. The formatter must parse each element,
		// not just the top-level value — otherwise the whole array falls through to a raw JSON dump.
		const doubleEncodedArray = [
			JSON.stringify({ ruleName: 'a', content: '# Rule A\n\nBody A.' }),
			JSON.stringify({ ruleName: 'b', content: '# Rule B\n\nBody B.' }),
		];
		const out = formatLintRules(doubleEncodedArray);
		expect(out).toContain('# Rule A');
		expect(out).toContain('# Rule B');
		expect(out).toContain('---');
		// The rendered output must be the markdown, never the raw JSON envelope of the record.
		expect(out).not.toContain('"ruleName"');
	});

	it('falls back to ruleName + description when there is no content', () => {
		const out = formatLintRules([{ ruleName: 'no-body', description: 'Short desc.' }]);
		expect(out).toContain('# no-body');
		expect(out).toContain('Short desc.');
	});

	it('returns null for unrecognised shapes', () => {
		expect(formatLintRules('plain text')).toBeNull();
		expect(formatLintRules([{ nope: 1 }])).toBeNull();
		expect(formatLintRules([])).toBeNull();
	});
});

describe('formatToken', () => {
	it('renders name, example value, and a token(...) usage line', () => {
		const out = formatToken([{ name: 'space.100', exampleValue: '8px' }]);
		expect(out).toContain('space.100');
		expect(out).toContain('Example value: 8px');
		expect(out).toContain("token('space.100')");
	});

	it('accepts a bare object (not wrapped in an array)', () => {
		const out = formatToken({ name: 'color.text', exampleValue: '#172B4D' });
		expect(out).toContain('color.text');
		expect(out).toContain('#172B4D');
	});

	it('returns null for unrecognised shapes', () => {
		expect(formatToken('plain text')).toBeNull();
		expect(formatToken([{ nope: 1 }])).toBeNull();
		expect(formatToken([])).toBeNull();
	});
});

describe('formatIcon', () => {
	it('renders name, package, a copy-paste import line, and usage', () => {
		const out = formatIcon([
			{ componentName: 'AddIcon', package: '@atlaskit/icon/core/add', usage: 'Adding an object.' },
		]);
		expect(out).toContain('AddIcon');
		expect(out).toContain('Package: @atlaskit/icon/core/add');
		expect(out).toContain("import AddIcon from '@atlaskit/icon/core/add';");
		expect(out).toContain('Adding an object.');
	});

	it('returns null for unrecognised shapes', () => {
		expect(formatIcon('plain text')).toBeNull();
		expect(formatIcon([{ nope: 1 }])).toBeNull();
		expect(formatIcon([])).toBeNull();
	});
});

describe('formatDisambiguation', () => {
	it('renders a header, candidate names, hints, and follow-up commands', () => {
		const out = formatDisambiguation({
			ambiguous: true,
			query: 'arrow',
			noun: 'icon',
			candidates: [
				{ name: 'ArrowUpIcon', hint: '@atlaskit/icon/core/arrow-up', followUp: 'icon ArrowUpIcon' },
				{ name: 'ArrowDownIcon', followUp: 'icon ArrowDownIcon' },
			],
		});
		expect(out).toContain('Multiple icons match "arrow"');
		expect(out).toContain('ArrowUpIcon  @atlaskit/icon/core/arrow-up');
		expect(out).toContain('→ ads-cli icon ArrowUpIcon');
		// A candidate without a hint still renders its follow-up.
		expect(out).toContain('→ ads-cli icon ArrowDownIcon');
	});
});
