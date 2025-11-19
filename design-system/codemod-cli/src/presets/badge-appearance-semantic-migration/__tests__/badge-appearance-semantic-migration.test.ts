import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/badge-appearance-semantic-migration';

const check = createCheck(transformer);

describe('badge-appearance-semantic-migration', () => {
	describe('appearance semantic migration', () => {
		check({
			it: 'should update appearance values to new semantic values',
			original: `
import Badge from '@atlaskit/badge';

export default function App() {
	return (
		<div>
			<Badge appearance="added">{5}</Badge>
			<Badge appearance="removed">{10}</Badge>
			<Badge appearance="default">{3}</Badge>
			<Badge appearance="primary">{7}</Badge>
			<Badge appearance="important">{99}</Badge>
		</div>
	);
}
`,
			expected: `
import Badge from '@atlaskit/badge';

export default function App() {
	return (
		<div>
			<Badge appearance="success">{5}</Badge>
			<Badge appearance="danger">{10}</Badge>
			<Badge appearance="neutral">{3}</Badge>
			<Badge appearance="information">{7}</Badge>
			<Badge appearance="danger">{99}</Badge>
		</div>
	);
}
`,
		});

		check({
			it: 'should handle primaryInverted with comment and migration',
			original: `
import Badge from '@atlaskit/badge';

export default function App() {
	return <Badge appearance="primaryInverted">{2}</Badge>;
}
`,
			expected: `
import Badge from '@atlaskit/badge';

export default function App() {
	return (
		/* TODO: (from codemod) FIXME: This Badge component used \`appearance="primaryInverted"\` which has been migrated to \`appearance="inverse"\`.
        Please verify the visual appearance matches your expectations. */
		<Badge appearance="inverse">{2}</Badge>
	);
}
`,
		});

		check({
			it: 'should handle dynamic appearance values with comment',
			original: `
import Badge from '@atlaskit/badge';

export default function App() {
	const status = getStatus();
	return <Badge appearance={status}>{count}</Badge>;
}
`,
			expected: `
import Badge from '@atlaskit/badge';

export default function App() {
	const status = getStatus();
	return (
		/* TODO: (from codemod) FIXME: This Badge component uses a dynamic \`appearance\` prop with updated semantic values.
        Please verify that the values being passed use the new semantic values: neutral, information, inverse, danger, success.
        Old values mapping: default→neutral, primary→information, primaryInverted→inverse, added→success, removed→danger, important→danger. */
		<Badge appearance={status}>{count}</Badge>
	);
}
`,
		});

		check({
			it: 'should handle renamed imports',
			original: `
import { default as MyBadge } from '@atlaskit/badge';

export default function App() {
	return <MyBadge appearance="added">{5}</MyBadge>;
}
`,
			expected: `
import { default as MyBadge } from '@atlaskit/badge';

export default function App() {
	return <MyBadge appearance="success">{5}</MyBadge>;
}
`,
		});

		check({
			it: 'should handle unknown appearance values with warning',
			original: `
import Badge from '@atlaskit/badge';

export default function App() {
	return <Badge appearance="unknown">{42}</Badge>;
}
`,
			expected: `
import Badge from '@atlaskit/badge';

export default function App() {
	return (
		/* TODO: (from codemod) FIXME: This Badge component uses an unknown \`appearance\` value "unknown".
        Valid new semantic appearance values are: success, danger, neutral, information, inverse.
        Please update this value to a valid semantic appearance value. */
		<Badge appearance="unknown">{42}</Badge>
	);
}
`,
		});
	});

	describe('mapping verification', () => {
		check({
			it: 'should map individual appearance values correctly',
			original: `
import Badge from '@atlaskit/badge';

export default function App() {
	return (
		<div>
			<Badge appearance="added">Added</Badge>
			<Badge appearance="removed">Removed</Badge>
			<Badge appearance="default">Default</Badge>
			<Badge appearance="primary">Primary</Badge>
		</div>
	);
}
`,
			expected: `
import Badge from '@atlaskit/badge';

export default function App() {
	return (
		<div>
			<Badge appearance="success">Added</Badge>
			<Badge appearance="danger">Removed</Badge>
			<Badge appearance="neutral">Default</Badge>
			<Badge appearance="information">Primary</Badge>
		</div>
	);
}
`,
		});

		check({
			it: 'should map important to danger',
			original: `
import Badge from '@atlaskit/badge';

export default function App() {
	return <Badge appearance="important">{99}</Badge>;
}
`,
			expected: `
import Badge from '@atlaskit/badge';

export default function App() {
	return <Badge appearance="danger">{99}</Badge>;
}
`,
		});
	});

	describe('edge cases', () => {
		check({
			it: 'should not transform non-Badge components',
			original: `
import Button from '@atlaskit/button';
import Badge from '@atlaskit/badge';

export default function App() {
	return (
		<div>
			<Button appearance="primary">Button</Button>
			<Badge appearance="added">{5}</Badge>
		</div>
	);
}
`,
			expected: `
import Button from '@atlaskit/button';
import Badge from '@atlaskit/badge';

export default function App() {
	return (
		<div>
			<Button appearance="primary">Button</Button>
			<Badge appearance="success">{5}</Badge>
		</div>
	);
}
`,
		});

		check({
			it: 'should not transform files without Badge imports',
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
			it: 'should handle Badge with only other props',
			original: `
import Badge from '@atlaskit/badge';

export default function App() {
	return <Badge testId="my-badge">{10}</Badge>;
}
`,
			expected: `
import Badge from '@atlaskit/badge';

export default function App() {
	return <Badge testId="my-badge">{10}</Badge>;
}
`,
		});

		check({
			it: 'should preserve other props when transforming appearance',
			original: `
import Badge from '@atlaskit/badge';

export default function App() {
	return (
		<Badge
			appearance="default"
			testId="my-badge"
			max={99}
		>
			{150}
		</Badge>
	);
}
`,
			expected: `
import Badge from '@atlaskit/badge';

export default function App() {
	return (
		<Badge
			appearance="neutral"
			testId="my-badge"
			max={99}
		>
			{150}
		</Badge>
	);
}
`,
		});

		check({
			it: 'should handle multiple Badge instances in same file',
			original: `
import Badge from '@atlaskit/badge';

export default function App() {
	return (
		<div>
			<Badge appearance="added">{5}</Badge>
			<Badge appearance="removed">{10}</Badge>
			<Badge appearance="default">{3}</Badge>
			<Badge appearance="primary">{7}</Badge>
			<Badge appearance="important">{99}</Badge>
		</div>
	);
}
`,
			expected: `
import Badge from '@atlaskit/badge';

export default function App() {
	return (
		<div>
			<Badge appearance="success">{5}</Badge>
			<Badge appearance="danger">{10}</Badge>
			<Badge appearance="neutral">{3}</Badge>
			<Badge appearance="information">{7}</Badge>
			<Badge appearance="danger">{99}</Badge>
		</div>
	);
}
`,
		});
	});
});
