import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/lozenge-appearance-to-color';

const check = createCheck(transformer);

describe('lozenge-appearance-to-color', () => {
	describe('appearance prop migration', () => {
		check({
			it: 'should rename appearance prop to color for semantic values',
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
			<Lozenge color="success">Success</Lozenge>
			<Lozenge color="neutral">Default</Lozenge>
			<Lozenge color="information">In Progress</Lozenge>
			<Lozenge color="warning">Moved</Lozenge>
			<Lozenge color="discovery">New</Lozenge>
			<Lozenge color="danger">Removed</Lozenge>
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
		/* TODO: (from codemod) FIXME: This Lozenge component uses a dynamic \`appearance\` prop that has been renamed to \`color\`.
        Please verify that the values being passed are valid color values (semantic: default, inprogress, moved, new, removed, success). */
		<Lozenge color={status}>Dynamic</Lozenge>
	);
}
`,
		});

		check({
			it: 'should handle renamed imports',
			original: `
import { default as Badge } from '@atlaskit/lozenge';

export default function App() {
	return <Badge appearance="success">Success</Badge>;
}
`,
			expected: `
import { default as Badge } from '@atlaskit/lozenge';

export default function App() {
	return <Badge color="success">Success</Badge>;
}
`,
		});

		check({
			it: 'should handle invalid appearance values with warning',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="invalid">Invalid Value</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		/* TODO: (from codemod) FIXME: This Lozenge component uses an invalid \`appearance\` value "invalid" that has been renamed to \`color\`.
        Valid semantic color values are: default, inprogress, moved, new, removed, success.
        Please update this value to a valid semantic color or use a custom color value. */
		<Lozenge color="invalid">Invalid Value</Lozenge>
	);
}
`,
		});
	});

	describe('multiple lozenges', () => {
		check({
			it: 'should handle multiple Lozenges with different appearance values',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<div>
			<Lozenge appearance="success">Success</Lozenge>
			<Lozenge appearance="default">Default</Lozenge>
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
			<Lozenge color="success">Success</Lozenge>
			<Lozenge color="neutral">Default</Lozenge>
			<Lozenge color="danger">Removed</Lozenge>
		</div>
	);
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
			<Lozenge appearance="success">Lozenge</Lozenge>
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
			<Lozenge color="success">Lozenge</Lozenge>
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
			appearance="success"
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
			color="success"
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
