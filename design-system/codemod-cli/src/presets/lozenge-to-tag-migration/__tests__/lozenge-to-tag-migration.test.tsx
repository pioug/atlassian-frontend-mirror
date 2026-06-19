import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/lozenge-to-tag-migration';

const check = createCheck(transformer);

describe('lozenge-to-tag-migration', () => {
	describe('no-op cases', () => {
		check({
			it: 'should not transform files with no Lozenge import',
			original: `
import Button from '@atlaskit/button';

export default function App() {
	return <Button appearance="primary">Click me</Button>;
}
`,
			expected: `
import Button from '@atlaskit/button';

export default function App() {
	return <Button appearance="primary">Click me</Button>;
}
`,
		});

		check({
			it: 'should not transform Lozenge with no appearance prop',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge>Default</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge>Default</Lozenge>;
}
`,
		});

		check({
			it: 'should not transform Lozenge with already-valid appearance "success"',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="success">Done</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="success">Done</Lozenge>;
}
`,
		});

		check({
			it: 'should not transform Lozenge with an unrecognised appearance value',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="custom">Custom</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="custom">Custom</Lozenge>;
}
`,
		});

		check({
			it: 'should not touch non-Lozenge component appearance props when Lozenge is also imported',
			original: `
import Button from '@atlaskit/button';
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<div>
			<Button appearance="primary">Click</Button>
			<Lozenge>No appearance</Lozenge>
		</div>
	);
}
`,
			expected: `
import Button from '@atlaskit/button';
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<div>
			<Button appearance="primary">Click</Button>
			<Lozenge>No appearance</Lozenge>
		</div>
	);
}
`,
		});
	});

	describe('appearance value mapping', () => {
		check({
			it: 'should map "default" to "neutral"',
			original: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge appearance="default">Default</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge appearance="neutral">Default</Lozenge>;
}
`,
		});

		check({
			it: 'should map "inprogress" to "information"',
			original: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge appearance="inprogress">In Progress</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge appearance="information">In Progress</Lozenge>;
}
`,
		});

		check({
			it: 'should map "moved" to "warning"',
			original: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge appearance="moved">Moved</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge appearance="warning">Moved</Lozenge>;
}
`,
		});

		check({
			it: 'should map "removed" to "danger"',
			original: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge appearance="removed">Removed</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge appearance="danger">Removed</Lozenge>;
}
`,
		});

		check({
			it: 'should map "new" to "discovery"',
			original: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge appearance="new">New</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge appearance="discovery">New</Lozenge>;
}
`,
		});

		check({
			it: 'should transform multiple Lozenge elements with different appearances',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<div>
			<Lozenge appearance="default">Default</Lozenge>
			<Lozenge appearance="inprogress">In Progress</Lozenge>
			<Lozenge appearance="moved">Moved</Lozenge>
			<Lozenge appearance="removed">Removed</Lozenge>
			<Lozenge appearance="new">New</Lozenge>
			<Lozenge appearance="success">Success</Lozenge>
		</div>
	);
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<div>
			<Lozenge appearance="neutral">Default</Lozenge>
			<Lozenge appearance="information">In Progress</Lozenge>
			<Lozenge appearance="warning">Moved</Lozenge>
			<Lozenge appearance="danger">Removed</Lozenge>
			<Lozenge appearance="discovery">New</Lozenge>
			<Lozenge appearance="success">Success</Lozenge>
		</div>
	);
}
`,
		});
	});

	describe('isBold prop', () => {
		check({
			it: 'should keep isBold={true} and still migrate appearance',
			original: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge isBold={true} appearance="default">Bold</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge isBold={true} appearance="neutral">Bold</Lozenge>;
}
`,
		});

		check({
			it: 'should keep isBold={false} and still migrate appearance',
			original: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge isBold={false} appearance="inprogress">Not Bold</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge isBold={false} appearance="information">Not Bold</Lozenge>;
}
`,
		});

		check({
			it: 'should keep boolean shorthand isBold and still migrate appearance',
			original: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge isBold appearance="moved">Bold</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge isBold appearance="warning">Bold</Lozenge>;
}
`,
		});
	});

	describe('dynamic appearance', () => {
		check({
			it: 'should add a FIXME comment and leave the prop untouched for a dynamic appearance',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	const status = getStatus();
	return <Lozenge appearance={status}>Dynamic</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	const status = getStatus();
	return (
		/* TODO: (from codemod) FIXME: This Lozenge uses a dynamic \`appearance\` prop. Please verify the values are updated to new semantic values: neutral, information, warning, danger, discovery, success. */
		<Lozenge appearance={status}>Dynamic</Lozenge>
	);
}
`,
		});

	});

	describe('other props are preserved', () => {
		check({
			it: 'should preserve testId and maxWidth while migrating appearance',
			original: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge testId="my-lozenge" maxWidth={150} appearance="default">Default</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	return <Lozenge testId="my-lozenge" maxWidth={150} appearance="neutral">Default</Lozenge>;
}
`,
		});

		check({
			it: 'should preserve spread attributes',
			original: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	const props = { testId: 'x' };
	return <Lozenge {...props} appearance="removed">Removed</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';
export default function App() {
	const props = { testId: 'x' };
	return <Lozenge {...props} appearance="danger">Removed</Lozenge>;
}
`,
		});
	});

	describe('renamed imports', () => {
		check({
			it: 'should handle a renamed default import',
			original: `
import MyLozenge from '@atlaskit/lozenge';
export default function App() {
	return <MyLozenge appearance="default">Default</MyLozenge>;
}
`,
			expected: `
import MyLozenge from '@atlaskit/lozenge';
export default function App() {
	return <MyLozenge appearance="neutral">Default</MyLozenge>;
}
`,
		});

		check({
			it: 'should handle a { default as X } named import',
			original: `
import { default as Badge } from '@atlaskit/lozenge';
export default function App() {
	return <Badge appearance="new">New</Badge>;
}
`,
			expected: `
import { default as Badge } from '@atlaskit/lozenge';
export default function App() {
	return <Badge appearance="discovery">New</Badge>;
}
`,
		});
	});
});
