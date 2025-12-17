import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/tag-to-newTag-migration';

const check = createCheck(transformer);

describe('tag-to-newTag-migration', () => {
	describe('Tag with Avatar in elemBefore', () => {
		check({
			it: 'should migrate Tag with Avatar to AvatarTag and convert to render props',
			original: `
import Tag from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';

export default function App() {
	return (
		<Tag
			appearance="rounded"
			text="John Doe"
			elemBefore={<Avatar src="x" />}
		/>
	);
}
`,
			expected: `
import Avatar from '@atlaskit/avatar';
import { AvatarTag } from '@atlaskit/tag';

export default function App() {
	return (
		<AvatarTag
			text="John Doe"
			avatar={(avatarProps) => <Avatar {...avatarProps} src="x" />}
		/>
	);
}
`,
		});

		check({
			it: 'should handle RemovableTag with Avatar in elemBefore',
			original: `
import { RemovableTag } from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';

export default function App() {
	return (
		<RemovableTag
			appearance="rounded"
			text="Jane Smith"
			elemBefore={<Avatar src="x" />}
			removeButtonLabel="Remove"
		/>
	);
}
`,
			expected: `
import Avatar from '@atlaskit/avatar';
import { AvatarTag } from '@atlaskit/tag';

export default function App() {
	return (
		<AvatarTag
			text="Jane Smith"
			avatar={(avatarProps) => <Avatar {...avatarProps} src="x" />}
			removeButtonLabel="Remove"
		/>
	);
}
`,
		});

		check({
			it: 'should remove color prop when migrating to AvatarTag',
			original: `
import Tag from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';

export default function App() {
	return (
		<Tag
			appearance="rounded"
			color="greyLight"
			text="User"
			elemBefore={<Avatar size="xsmall" />}
		/>
	);
}
`,
			expected: `
import Avatar from '@atlaskit/avatar';
import { AvatarTag } from '@atlaskit/tag';

export default function App() {
	return (
		<AvatarTag
			text="User"
			avatar={(avatarProps) => <Avatar {...avatarProps} size="xsmall" />}
		/>
	);
}
`,
		});

		check({
			it: 'should add isRemovable={false} for SimpleTag with Avatar',
			original: `
import { SimpleTag } from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';

export default function App() {
	return (
		<SimpleTag
			appearance="rounded"
			text="Simple User"
			elemBefore={<Avatar size="xsmall" />}
		/>
	);
}
`,
			expected: `
import Avatar from '@atlaskit/avatar';
import { AvatarTag } from '@atlaskit/tag';

export default function App() {
	return (
		<AvatarTag
			text="Simple User"
			avatar={(avatarProps) => <Avatar {...avatarProps} size="xsmall" />}
			isRemovable={false}
		/>
	);
}
`,
		});

		check({
			it: 'should preserve Avatar props when converting to render props',
			original: `
import Tag from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';

export default function App() {
	return (
		<Tag
			appearance="rounded"
			text="No Size"
			elemBefore={<Avatar name="John Doe" />}
		/>
	);
}
`,
			expected: `
import Avatar from '@atlaskit/avatar';
import { AvatarTag } from '@atlaskit/tag';

export default function App() {
	return (
		<AvatarTag
			text="No Size"
			avatar={(avatarProps) => <Avatar {...avatarProps} name="John Doe" />}
		/>
	);
}
`,
		});
	});

	describe('Color migration for regular Tags', () => {
		check({
			it: 'should migrate all Light color variants',
			original: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		<div>
			<Tag color="limeLight" text="Lime" />
			<Tag color="orangeLight" text="Orange" />
			<Tag color="magentaLight" text="Magenta" />
			<Tag color="greenLight" text="Green" />
			<Tag color="blueLight" text="Blue" />
			<Tag color="redLight" text="Red" />
			<Tag color="purpleLight" text="Purple" />
			<Tag color="greyLight" text="Grey" />
			<Tag color="tealLight" text="Teal" />
			<Tag color="yellowLight" text="Yellow" />
		</div>
	);
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		<div>
			<Tag color="lime" text="Lime" />
			<Tag color="orange" text="Orange" />
			<Tag color="magenta" text="Magenta" />
			<Tag color="green" text="Green" />
			<Tag color="blue" text="Blue" />
			<Tag color="red" text="Red" />
			<Tag color="purple" text="Purple" />
			<Tag color="gray" text="Grey" />
			<Tag color="teal" text="Teal" />
			<Tag color="yellow" text="Yellow" />
		</div>
	);
}
`,
		});

		check({
			it: 'should migrate grey to gray',
			original: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag color="grey" text="Grey Tag" />;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag color="gray" text="Grey Tag" />;
}
`,
		});

		check({
			it: 'should handle dynamic color values (no migration)',
			original: `
import Tag from '@atlaskit/tag';

export default function App() {
	const tagColor = getColor();
	return <Tag color={tagColor} text="Dynamic" />;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	const tagColor = getColor();
	return <Tag color={tagColor} text="Dynamic" />;
}
`,
		});
	});

	describe('Tag without Avatar', () => {
		check({
			it: 'should remove appearance for regular Tag',
			original: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		<Tag
			appearance="rounded"
			text="Regular Tag"
			color="blue"
		/>
	);
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		<Tag
			text="Regular Tag"
			color="blue"
		/>
	);
}
`,
		});

		check({
			it: 'should handle Tag with elemBefore that is not an Avatar',
			original: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		<Tag
			appearance="default"
			text="Tag with Icon"
			elemBefore={<span>🏷️</span>}
		/>
	);
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		<Tag
			text="Tag with Icon"
			elemBefore={<span>🏷️</span>}
		/>
	);
}
`,
		});
	});

	describe('Import migrations', () => {
		check({
			it: 'should migrate import from removable-tag entry point',
			original: `
import RemovableTag from '@atlaskit/tag/removable-tag';

export default function App() {
	return <RemovableTag appearance="rounded" text="Removable" color="blueLight" />;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag text="Removable" color="blue" />;
}
`,
		});

		check({
			it: 'should migrate import from simple-tag entry point',
			original: `
import SimpleTag from '@atlaskit/tag/simple-tag';

export default function App() {
	return <SimpleTag appearance="rounded" text="Simple" color="greenLight" />;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag text="Simple" color="green" isRemovable={false} />;
}
`,
		});

		check({
			it: 'should handle SimpleTag named import',
			original: `
import { SimpleTag } from '@atlaskit/tag';

export default function App() {
	return <SimpleTag appearance="rounded" text="Simple" color="blue" />;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag text="Simple" color="blue" isRemovable={false} />;
}
`,
		});

		check({
			it: 'should handle RemovableTag named import',
			original: `
import { RemovableTag } from '@atlaskit/tag';

export default function App() {
	return <RemovableTag appearance="rounded" text="Removable" />;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag text="Removable" />;
}
`,
		});
	});

	describe('Edge cases', () => {
		check({
			it: 'should not transform files without Tag imports',
			original: `
import Button from '@atlaskit/button';

export default function App() {
	return <Button>Click me</Button>;
}
`,
			expected: `
import Button from '@atlaskit/button';

export default function App() {
	return <Button>Click me</Button>;
}
`,
		});

		check({
			it: 'should handle renamed Tag imports',
			original: `
import MyTag from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';

export default function App() {
	return (
		<MyTag
			appearance="rounded"
			text="Renamed"
			elemBefore={<Avatar size="xsmall" />}
		/>
	);
}
`,
			expected: `
import Avatar from '@atlaskit/avatar';
import { AvatarTag } from '@atlaskit/tag';

export default function App() {
	return (
		<AvatarTag
			text="Renamed"
			avatar={(avatarProps) => <Avatar {...avatarProps} size="xsmall" />}
		/>
	);
}
`,
		});

		check({
			it: 'should preserve other props when transforming',
			original: `
import Tag from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';

export default function App() {
	return (
		<Tag
			appearance="rounded"
			color="greyLight"
			text="User Tag"
			elemBefore={<Avatar size="xsmall" />}
			testId="user-tag"
			href="/user/123"
		/>
	);
}
`,
			expected: `
import Avatar from '@atlaskit/avatar';
import { AvatarTag } from '@atlaskit/tag';

export default function App() {
	return (
		<AvatarTag
			text="User Tag"
			avatar={(avatarProps) => <Avatar {...avatarProps} size="xsmall" />}
			testId="user-tag"
			href="/user/123"
		/>
	);
}
`,
		});

		check({
			it: 'should handle multiple Tag instances in same file',
			original: `
import Tag from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';

export default function App() {
	return (
		<div>
			<Tag
				appearance="rounded"
				text="User 1"
				elemBefore={<Avatar size="xsmall" />}
			/>
			<Tag
				appearance="default"
				text="Label"
				color="blue"
			/>
			<Tag
				appearance="rounded"
				text="User 2"
				elemBefore={<Avatar size="xsmall" />}
				color="greyLight"
			/>
		</div>
	);
}
`,
			expected: `
import Avatar from '@atlaskit/avatar';

import Tag from '@atlaskit/tag';
import { AvatarTag } from '@atlaskit/tag';

export default function App() {
	return (
		<div>
			<AvatarTag
				text="User 1"
				avatar={(avatarProps) => <Avatar {...avatarProps} size="xsmall" />}
			/>
			<Tag
				text="Label"
				color="blue"
			/>
			<AvatarTag
				text="User 2"
				avatar={(avatarProps) => <Avatar {...avatarProps} size="xsmall" />}
			/>
		</div>
	);
}
`,
		});

		check({
			it: 'should only migrate if Avatar is imported from @atlaskit/avatar',
			original: `
import Tag from '@atlaskit/tag';

function Avatar() {
	return <div>Custom Avatar</div>;
}

export default function App() {
	return (
		<Tag
			appearance="rounded"
			text="User"
			elemBefore={<Avatar />}
		/>
	);
}
`,
			expected: `
import Tag from '@atlaskit/tag';

function Avatar() {
	return <div>Custom Avatar</div>;
}

export default function App() {
	return (
		<Tag
			text="User"
			elemBefore={<Avatar />}
		/>
	);
}
`,
		});

		check({
			it: 'should handle Tag with children and Avatar',
			original: `
import Tag from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';

export default function App() {
	return (
		<Tag
			appearance="rounded"
			elemBefore={<Avatar size="xsmall" />}
		>
			Content
		</Tag>
	);
}
`,
			expected: `
import Avatar from '@atlaskit/avatar';
import { AvatarTag } from '@atlaskit/tag';

export default function App() {
	return (
		<AvatarTag
			avatar={(avatarProps) => <Avatar {...avatarProps} size="xsmall" />}
		>
			Content
		</AvatarTag>
	);
}
`,
		});

		check({
			it: 'should handle default appearance value',
			original: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag appearance="default" text="Default" />;
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return <Tag text="Default" />;
}
`,
		});

		check({
			it: 'should handle mixed SimpleTag and RemovableTag in same file',
			original: `
import { SimpleTag, RemovableTag } from '@atlaskit/tag';

export default function App() {
	return (
		<div>
			<SimpleTag appearance="rounded" text="Simple" color="blue" />
			<RemovableTag appearance="rounded" text="Removable" color="redLight" />
		</div>
	);
}
`,
			expected: `
import Tag from '@atlaskit/tag';

export default function App() {
	return (
		<div>
			<Tag text="Simple" color="blue" isRemovable={false} />
			<Tag text="Removable" color="red" />
		</div>
	);
}
`,
		});

		check({
			it: 'should handle SimpleTag from simple-tag entry point with Avatar',
			original: `
import SimpleTag from '@atlaskit/tag/simple-tag';
import Avatar from '@atlaskit/avatar';

export default function App() {
	return (
		<SimpleTag
			appearance="rounded"
			text="Simple User"
			elemBefore={<Avatar size="xsmall" />}
		/>
	);
}
`,
			expected: `
import Avatar from '@atlaskit/avatar';
import { AvatarTag } from '@atlaskit/tag';

export default function App() {
	return (
		<AvatarTag
			text="Simple User"
			avatar={(avatarProps) => <Avatar {...avatarProps} size="xsmall" />}
			isRemovable={false}
		/>
	);
}
`,
		});
	});
});
