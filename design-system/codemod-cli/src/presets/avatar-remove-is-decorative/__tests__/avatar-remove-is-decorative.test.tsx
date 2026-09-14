import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/avatar-remove-is-decorative';

const check = createCheck(transformer);

describe('avatar-remove-is-decorative', () => {
	describe('isDecorative={true} → label=""', () => {
		check({
			it: 'should replace isDecorative={true} with label=""',
			original: `
import Avatar from '@atlaskit/avatar/avatar';

export default function App() {
	return <Avatar name="John Smith" src="/path/to/img.jpg" isDecorative={true} />;
}
`,
			expected: `
import Avatar from '@atlaskit/avatar/avatar';

export default function App() {
	return <Avatar name='John Smith' src='/path/to/img.jpg' label='' />;
}
`,
		});

		check({
			it: 'should replace bare isDecorative with label=""',
			original: `
import Avatar from '@atlaskit/avatar/avatar';

export default function App() {
	return <Avatar name="John Smith" isDecorative />;
}
`,
			expected: `
import Avatar from '@atlaskit/avatar/avatar';

export default function App() {
	return <Avatar name='John Smith' label='' />;
}
`,
		});
	});

	describe('isDecorative={false} → removed', () => {
		check({
			it: 'should remove isDecorative={false} without adding label',
			original: `
import Avatar from '@atlaskit/avatar/avatar';

export default function App() {
	return <Avatar name="John Smith" isDecorative={false} />;
}
`,
			expected: `
import Avatar from '@atlaskit/avatar/avatar';

export default function App() {
	return <Avatar name='John Smith' />;
}
`,
		});
	});

	describe('dynamic isDecorative → removed with TODO comment', () => {
		check({
			it: 'should remove dynamic isDecorative and add a TODO comment',
			original: `
import Avatar from '@atlaskit/avatar/avatar';

export default function App() {
	const isDecorative = getIsDecorative();
	return <Avatar name="John Smith" isDecorative={isDecorative} />;
}
`,
			expected: `
import Avatar from '@atlaskit/avatar/avatar';

export default function App() {
	const isDecorative = getIsDecorative();
	/* TODO: (from codemod) The \`isDecorative\` prop has been removed from Avatar. If this avatar should be decorative (hidden from assistive technologies), add \`label=""\`. Otherwise, ensure the \`name\` or \`label\` prop provides a meaningful description. */
	return <Avatar name='John Smith' />;
}
`,
		});
	});

	describe('no-op cases', () => {
		check({
			it: 'should not transform files without Avatar import',
			original: `
import Button from '@atlaskit/button/button';

export default function App() {
	return <Button isDecorative>Click me</Button>;
}
`,
			expected: `
import Button from '@atlaskit/button/button';

export default function App() {
	return <Button isDecorative>Click me</Button>;
}
`,
		});

		check({
			it: 'should not transform Avatar without isDecorative prop',
			original: `
import Avatar from '@atlaskit/avatar/avatar';

export default function App() {
	return <Avatar name="John Smith" />;
}
`,
			expected: `
import Avatar from '@atlaskit/avatar/avatar';

export default function App() {
	return <Avatar name="John Smith" />;
}
`,
		});
	});

	describe('entry points', () => {
		check({
			it: 'should work with @atlaskit/avatar barrel entry point',
			original: `
import Avatar from '@atlaskit/avatar';

export default function App() {
	return <Avatar name="John Smith" isDecorative={true} />;
}
`,
			expected: `
import Avatar from '@atlaskit/avatar';

export default function App() {
	return <Avatar name='John Smith' label='' />;
}
`,
		});
	});
});
