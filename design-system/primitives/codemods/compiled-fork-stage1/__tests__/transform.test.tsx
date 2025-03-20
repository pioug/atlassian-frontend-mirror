import jscodeshift from 'jscodeshift';

import transform from '../transform';

interface Options {
	parser: string;
}

async function applyTransform(
	transform: any,
	input: string,
	options: Options = {
		parser: 'tsx',
	},
) {
	const transformer = transform.default ? transform.default : transform;
	const withParser = jscodeshift.withParser(options.parser);
	const output = await transformer({ source: input }, { j: withParser, jscodeshift: withParser });

	return !output ? input : output.trim();
}

describe('transform', () => {
	it('should transform basic import from @atlaskit/primitives', async () => {
		const input = `import { Box } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);

		expect(output).toEqual(`import { Box } from "@atlaskit/primitives/compiled";`);
	});

	it('should transform multiple imports from @atlaskit/primitives', async () => {
		const input = `
import { Box } from '@atlaskit/primitives';
import { Stack } from '@atlaskit/primitives';
		`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box } from "@atlaskit/primitives/compiled";
import { Stack } from "@atlaskit/primitives/compiled";`);
	});

	it('should transform named imports with multiple specifiers', async () => {
		const input = `import { Box, Stack, Inline } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box, Stack, Inline } from "@atlaskit/primitives/compiled";`);
	});

	it('should NOT transform when xcss is imported', async () => {
		const input = `import { Box, xcss } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box, xcss } from '@atlaskit/primitives';`);
	});

	it('should NOT transform other imports', async () => {
		const input = `
			import { Box } from '@atlaskit/primitives';
			import { something } from '@atlaskit/other-package';
			import { Stack } from '@atlaskit/primitives';
		`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box } from "@atlaskit/primitives/compiled";
			import { something } from '@atlaskit/other-package';
			import { Stack } from "@atlaskit/primitives/compiled";`);
	});

	it('should handle empty imports', async () => {
		const input = `import {} from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import {} from "@atlaskit/primitives/compiled";`);
	});

	it('should handle imports with type specifiers', async () => {
		const input = `import type { BoxProps } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import type { BoxProps } from "@atlaskit/primitives/compiled";`);
	});

	it('should transform aliased named imports', async () => {
		const input = `import { Box as AtlaskitBox } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box as AtlaskitBox } from "@atlaskit/primitives/compiled";`);
	});

	it('should transform multiple aliased named imports', async () => {
		const input = `import { Box as AtlaskitBox, Stack as AtlaskitStack } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(
			`import { Box as AtlaskitBox, Stack as AtlaskitStack } from "@atlaskit/primitives/compiled";`,
		);
	});

	it('should transform mixed aliased and non-aliased imports', async () => {
		const input = `import { Box as AtlaskitBox, Stack, Inline as AtlaskitInline } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(
			`import { Box as AtlaskitBox, Stack, Inline as AtlaskitInline } from "@atlaskit/primitives/compiled";`,
		);
	});

	it('should NOT transform aliased imports when xcss is present', async () => {
		const input = `import { Box as AtlaskitBox, xcss } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box as AtlaskitBox, xcss } from '@atlaskit/primitives';`);
	});
});
