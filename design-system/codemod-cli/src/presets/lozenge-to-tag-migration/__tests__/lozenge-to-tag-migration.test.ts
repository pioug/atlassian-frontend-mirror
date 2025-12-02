import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/lozenge-to-tag-migration';

const check = createCheck(transformer);

describe('lozenge-to-tag-migration', () => {
	describe('basic migration', () => {
		check({
			it: 'should migrate Lozenge without isBold to Tag',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="success">Success</Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag text="Success" color="lime" />;
}
`,
		});

		check({
			it: 'should migrate Lozenge with isBold={false} to Tag',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge isBold={false} appearance="default">Default</Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag text="Default" color="standard" />;
}
`,
		});

		check({
			it: 'should not migrate Lozenge with isBold={true}',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge isBold={true} appearance="success">Bold Success</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge isBold={true} appearance="success">Bold Success</Lozenge>;
}
`,
		});

		check({
			it: 'should not migrate Lozenge with isBold (boolean prop)',
			original: `
import AKLozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge isBold appearance="success">Bold Success</Lozenge>;
}
`,
			expected: `
import AKLozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge isBold appearance="success">Bold Success</Lozenge>;
}
`,
		});
	});

	describe('appearance to color mapping', () => {
		check({
			it: 'should map all appearance values correctly',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<div>
			<Lozenge appearance="success">Success</Lozenge>
			<Lozenge appearance="default">Default</Lozenge>
			<Lozenge appearance="removed">Removed</Lozenge>
			<Lozenge appearance="inprogress">In Progress</Lozenge>
			<Lozenge appearance="new">New</Lozenge>
			<Lozenge appearance="moved">Moved</Lozenge>
		</div>
	);
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		<div>
			<Tag text="Success" color="lime" />
			<Tag text="Default" color="standard" />
			<Tag text="Removed" color="red" />
			<Tag text="In Progress" color="blue" />
			<Tag text="New" color="purple" />
			<Tag text="Moved" color="orange" />
		</div>
	);
}
`,
		});

		check({
			it: 'should handle unknown appearance values with warning',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="unknown">Unknown</Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		/* TODO: (from codemod) FIXME: This Tag component uses an unknown appearance value "unknown".
        Please update to a valid Tag color: standard, green, lime, blue, red, purple, magenta, grey, teal, orange, yellow. */
		<Tag text="Unknown" color="unknown" />
	);
}
`,
		});

		check({
			it: 'should handle dynamic appearance values with warning',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	const status = getStatus();
	return <Lozenge appearance={status}>Dynamic</Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	const status = getStatus();
	return (
		/* TODO: (from codemod) FIXME: This Tag component uses a dynamic \`appearance\` prop that has been renamed to \`color\`.
        Please verify that the values being passed are valid color values (semantic: default, inprogress, moved, new, removed, success). */
		<Tag text="Dynamic" color={status} />
	);
}
`,
		});
	});

	describe('prop handling', () => {
		check({
			it: 'should remove maxWidth prop with warning',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge maxWidth={150} appearance="success">Success</Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		/* TODO: (from codemod) FIXME: maxWidth prop was removed during migration from Lozenge to Tag.
        Tag component does not support maxWidth. Please review if width constraints are needed. */
		<Tag text="Success" color="lime" />
	);
}
`,
		});

		check({
			it: 'should preserve other props',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge testId="my-lozenge" appearance="success">Success</Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag text="Success" testId="my-lozenge" color="lime" />;
}
`,
		});

		check({
			it: 'should handle style prop with warning',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge style={{ backgroundColor: 'red' }} appearance="success">Success</Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		/* TODO: (from codemod) FIXME: This Tag component has a style prop that was kept during migration.
        Tag component has limited style support. Please review if custom styles are compatible. */
		<Tag text="Success" style={{ backgroundColor: 'red' }} color="lime"/>
	);
}
`,
		});
	});

	describe('dynamic isBold handling', () => {
		check({
			it: 'should add warning for dynamic isBold without migrating',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	const shouldBeBold = getBoldness();
	return <Lozenge isBold={shouldBeBold} appearance="success">Dynamic Bold</Lozenge>;
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	const shouldBeBold = getBoldness();
	return (
		/* TODO: (from codemod) FIXME: This Lozenge component uses a dynamic \`isBold\` prop. Please manually review if this should be migrated to Tag component.
        If isBold is typically false, consider migrating to <Tag /> from '@atlaskit/tag'. */
		<Lozenge isBold={shouldBeBold} appearance="success">Dynamic Bold</Lozenge>
	);
}
`,
		});
	});

	describe('import handling', () => {
		check({
			it: 'should handle renamed imports',
			original: `
import { default as Badge } from '@atlaskit/lozenge';

export default function App() {
	return <Badge appearance="success">Success</Badge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag text="Success" color="lime" />;
}
`,
		});

		check({
			it: 'should not add Tag import if already present',
			original: `
import Lozenge from '@atlaskit/lozenge';
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		<div>
			<Tag text="Existing" color="blue" />
			<Lozenge appearance="success">To Migrate</Lozenge>
		</div>
	);
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		<div>
			<Tag text="Existing" color="blue" />
			<Tag text="To Migrate" color="lime" />
		</div>
	);
}
`,
		});
	});

	describe('children to text conversion', () => {
		check({
			it: 'should convert simple text children to text prop',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="success">Simple Text</Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag text="Simple Text" color="lime" />;
}
`,
		});

		check({
			it: 'should handle complex children with TODO comment',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<Lozenge appearance="success">
			<strong>Bold</strong> text with <em>emphasis</em>
		</Lozenge>
	);
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		/* TODO: (from codemod) FIXME: This Tag component has complex children that couldn't be automatically migrated to the text prop.
        Tag component only supports simple text via the text prop. Please manually convert the children content. */
		<Tag color="lime" />
	);
}
`,
		});

		check({
			it: 'should handle whitespace-only children',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="success">   </Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag color="lime" />;
}
`,
		});

		check({
			it: 'should handle string expression children',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="success">{"Simple String"}</Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag text="Simple String" color="lime" />;
}
`,
		});

		check({
			it: 'should handle multiple text nodes with TODO comment',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="success">Part 1 {" "} Part 2</Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		/* TODO: (from codemod) FIXME: This Tag component has complex children that couldn't be automatically migrated to the text prop.
        Tag component only supports simple text via the text prop. Please manually convert the children content. */
		<Tag color="lime" />
	);
}
`,
		});

		check({
			it: 'should migrate variable children with verification warning',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	const label = 'Dynamic Label';
	return <Lozenge appearance="success">{label}</Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	const label = 'Dynamic Label';
	return (
		/* TODO: (from codemod) FIXME: This Tag component uses a variable as the text prop. Please verify that the variable contains a string value. */
		<Tag text={label} color="lime" />
	);
}
`,
		});

		check({
			it: 'should migrate member expression children with verification warning',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	const data = { title: 'Member Title' };
	return <Lozenge appearance="success">{data.title}</Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	const data = { title: 'Member Title' };
	return (
		/* TODO: (from codemod) FIXME: This Tag component uses a variable as the text prop. Please verify that the variable contains a string value. */
		<Tag text={data.title} color="lime" />
	);
}
`,
		});

		check({
			it: 'should migrate deeply nested member expression',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	const config = { ui: { label: 'Nested Label' } };
	return <Lozenge appearance="success">{config.ui.label}</Lozenge>;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	const config = { ui: { label: 'Nested Label' } };
	return (
		/* TODO: (from codemod) FIXME: This Tag component uses a variable as the text prop. Please verify that the variable contains a string value. */
		<Tag text={config.ui.label} color="lime" />
	);
}
`,
		});
	});

	describe('edge cases', () => {
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
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		<div>
			<Button appearance="primary">Button</Button>
			<Tag text="Lozenge" color="lime" />
		</div>
	);
}
`,
		});

		check({
			it: 'should handle Lozenge with no children',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return <Lozenge appearance="success" />;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag color="lime" />;
}
`,
		});

		check({
			it: 'should handle mixed migration scenarios',
			original: `
import Lozenge from '@atlaskit/lozenge';

export default function App() {
	return (
		<div>
			<Lozenge appearance="success">Should migrate</Lozenge>
			<Lozenge isBold={false} appearance="default">Should migrate</Lozenge>
			<Lozenge isBold={true} appearance="new">Should NOT migrate</Lozenge>
			<Lozenge isBold appearance="moved">Should NOT migrate</Lozenge>
		</div>
	);
}
`,
			expected: `
import Lozenge from '@atlaskit/lozenge';

import Tag from '@atlaskit/tag';

export default function App() {
	return (
		<div>
			<Tag text="Should migrate" color="lime" />
			<Tag text="Should migrate" color="standard" />
			<Lozenge isBold={true} appearance="new">Should NOT migrate</Lozenge>
			<Lozenge isBold appearance="moved">Should NOT migrate</Lozenge>
		</div>
	);
}
`,
		});
	});
});
