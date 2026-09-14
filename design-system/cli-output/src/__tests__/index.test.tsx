import { humanFormat } from '..';

const stripAnsi = (value: string): string => value.replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, '');

it('renders a GitHub-dark-like code surface with compact indentation', () => {
	const output = stripAnsi(humanFormat.codeBlock('\tconst Button = () => null;'));
	const [header, code] = output.split('\n');
	expect(header).toContain('tsx');
	expect(output).toContain('  const Button = () => null;');
	expect(output).not.toContain('\t');
	expect(header).toHaveLength(code.length);
});

it('renders aligned property columns and highlights the property name', () => {
	const output = stripAnsi(
		humanFormat
			.propertyTable([
				{ name: 'isDisabled', type: 'boolean' },
				{ name: 'appearance', type: '"default" | "primary"' },
			])
			.join('\n'),
	);
	expect(output).toContain('Props (2)');
	expect(output).not.toContain('NAME');
	expect(output).not.toContain('TYPE');
	expect(output).toContain('appearance  "default" | "primary"');
});

it('renders shared metadata with consistent separators', () => {
	const output = stripAnsi(
		humanFormat.metadata(['general-availability', 'form', '@atlaskit/button']),
	);
	expect(output).toBe('general-availability  ·  form  ·  @atlaskit/button');
});
