import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/lozenge-appearance-semantic-migration';

const check = createCheck(transformer);

describe('lozenge-appearance-semantic-migration', () => {
	describe('appearance semantic migration', () => {
		check({
			it: 'should update appearance values to new semantic values',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<div>
			<Lozenge appearance="success">Success</Lozenge>
			<Lozenge appearance="default">Default</Lozenge>
			<Lozenge appearance="inprogress">In Progress</Lozenge>
			<Lozenge appearance="moved">Moved</Lozenge>
			<Lozenge appearance="new">New</Lozenge>
			<Lozenge appearance="removed">Removed</Lozenge>
		</div>
	);
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<div>
			<Lozenge appearance="success">Success</Lozenge>
			<Lozenge appearance="neutral">Default</Lozenge>
			<Lozenge appearance="information">In Progress</Lozenge>
			<Lozenge appearance="warning">Moved</Lozenge>
			<Lozenge appearance="discovery">New</Lozenge>
			<Lozenge appearance="danger">Removed</Lozenge>
		</div>
	);
}
`,
		});

		check({
			it: 'should handle dynamic appearance values with comment',
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
		/* TODO: (from codemod) FIXME: This Lozenge component uses a dynamic \`appearance\` prop with updated semantic values.
        Please verify that the values being passed use the new semantic values: neutral, information, warning, discovery, danger, success.
        Old values mapping: default→neutral, inprogress→information, moved→warning, new→discovery, removed→danger, success→success. */
		<Lozenge appearance={status}>Dynamic</Lozenge>
	);
}
`,
		});

		check({
			it: 'should handle renamed imports',
			original: `
import { default as Badge } from '@atlaskit/lozenge';

export default function App() {
	return <Badge appearance="default">Default</Badge>;
}
`,
			expected: `
import { default as Badge } from '@atlaskit/lozenge';

export default function App() {
	return <Badge appearance="neutral">Default</Badge>;
}
`,
		});

		check({
			it: 'should handle unknown appearance values with warning',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="unknown">Unknown Value</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		/* TODO: (from codemod) FIXME: This Lozenge component uses an unknown \`appearance\` value "unknown".
        Valid new semantic appearance values are: neutral, information, warning, discovery, danger, success.
        Please update this value to a valid semantic appearance value. */
		<Lozenge appearance="unknown">Unknown Value</Lozenge>
	);
}
`,
		});
	});

	describe('mapping verification', () => {
		check({
			it: 'should map individual appearance values correctly',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<div>
			<Lozenge appearance="default">Old Default</Lozenge>
			<Lozenge appearance="inprogress">Old InProgress</Lozenge>
			<Lozenge appearance="moved">Old Moved</Lozenge>
			<Lozenge appearance="new">Old New</Lozenge>
			<Lozenge appearance="removed">Old Removed</Lozenge>
		</div>
	);
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<div>
			<Lozenge appearance="neutral">Old Default</Lozenge>
			<Lozenge appearance="information">Old InProgress</Lozenge>
			<Lozenge appearance="warning">Old Moved</Lozenge>
			<Lozenge appearance="discovery">Old New</Lozenge>
			<Lozenge appearance="danger">Old Removed</Lozenge>
		</div>
	);
}
`,
		});

		check({
			it: 'should not change success value as it maps to itself',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="success">Success stays same</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="success">Success stays same</Lozenge>;
}
`,
		});
	});

	describe('edge cases', () => {
		check({
			it: 'should not transform non-Lozenge components',
			original: `
import Button from '@atlaskit/button';
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<div>
			<Button appearance="primary">Button</Button>
			<Lozenge appearance="default">Lozenge</Lozenge>
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
			<Button appearance="primary">Button</Button>
			<Lozenge appearance="neutral">Lozenge</Lozenge>
		</div>
	);
}
`,
		});

		check({
			it: 'should not transform files without Lozenge imports',
			original: `
import Button from '@atlaskit/button';

export default function App() {
	return <Button appearance="primary">Button</Button>;
}
`,
			expected: `
import Button from '@atlaskit/button';

export default function App() {
	return <Button appearance="primary">Button</Button>;
}
`,
		});

		check({
			it: 'should handle Lozenge with only other props',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge testId="my-lozenge">No appearance</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge testId="my-lozenge">No appearance</Lozenge>;
}
`,
		});

		check({
			it: 'should preserve other props when transforming appearance',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<Lozenge
			appearance="default"
			testId="my-lozenge"
			maxWidth={150}
			isBold={true}
		>
			With Other Props
		</Lozenge>
	);
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<Lozenge
			appearance="neutral"
			testId="my-lozenge"
			maxWidth={150}
			isBold={true}
		>
			With Other Props
		</Lozenge>
	);
}
`,
		});
	});
});
