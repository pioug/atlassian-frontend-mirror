import transform from '../transform';

const apply = require('jscodeshift/dist/testUtils').applyTransform;

async function applyTransform(transform: any, input: string) {
	const output = await apply(transform, {}, { source: input }, { parser: 'tsx' });

	return output.trimEnd();
}

describe('transform', () => {
	it('should transform basic import from @atlaskit/primitives', async () => {
		const input = `import { Box } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);

		expect(output).toEqual(`import { Box } from '@atlaskit/primitives/compiled';`);
	});

	it('should transform multiple imports from @atlaskit/primitives', async () => {
		const input = `
import { Box } from '@atlaskit/primitives';
import { Stack } from '@atlaskit/primitives';
		`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box } from '@atlaskit/primitives/compiled';
import { Stack } from '@atlaskit/primitives/compiled';`);
	});

	it('should transform named imports with multiple specifiers', async () => {
		const input = `import { Box, Stack, Inline } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box, Stack, Inline } from '@atlaskit/primitives/compiled';`);
	});

	it('should NOT transform when xcss is imported', async () => {
		const input = `import { Box, xcss } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box, xcss } from '@atlaskit/primitives';`);
	});

	it('should NOT transform  the file when xcss is imported with Grid', async () => {
		const input = `import { Grid, xcss } from '@atlaskit/primitives';

const gridStyles = xcss({
	width: '100%'
});

const MyComponent = () => (
	<Grid templateAreas={['title-close']} xcss={gridStyles} />
);`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Grid, xcss } from '@atlaskit/primitives';

const gridStyles = xcss({
	width: '100%'
});

const MyComponent = () => (
	<Grid templateAreas={['title-close']} xcss={gridStyles} />
);`);
	});

	it('should NOT transform  the file when media is imported', async () => {
		const input = `import { media } from '@atlaskit/primitives';

const imageStyles = css({
	width: '100%',
	[media.above.md]: {
		width: '125%',
	},
});`;

		const output = await applyTransform(transform, input);
		expect(output).toEqual(input);
	});

	it('should NOT transform  the file when XCSS type is imported', async () => {
		const input = `import { XCSS } from '@atlaskit/primitives';
export interface Props { yo: XCSS; }`;

		const output = await applyTransform(transform, input);
		expect(output).toEqual(input);
	});

	it('should NOT transform other imports', async () => {
		const input = `
import { Box } from '@atlaskit/primitives';
import { something } from '@atlaskit/other-package';
import { Stack } from '@atlaskit/primitives';
		`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box } from '@atlaskit/primitives/compiled';
import { something } from '@atlaskit/other-package';
import { Stack } from '@atlaskit/primitives/compiled';`);
	});

	it('should NOT transform Box primitives with spread props', async () => {
		const input = `import { Box } from '@atlaskit/primitives';
const MyComponent = (props: any) => <Box {...props} />`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(input);
	});

	it('should handle empty imports', async () => {
		const input = `import {} from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import {} from '@atlaskit/primitives/compiled';`);
	});

	it('should transform aliased named imports', async () => {
		const input = `import { Box as AtlaskitBox } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box as AtlaskitBox } from '@atlaskit/primitives/compiled';`);
	});

	it('should transform multiple aliased named imports', async () => {
		const input = `import { Box as AtlaskitBox, Stack as AtlaskitStack } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(
			`import { Box as AtlaskitBox, Stack as AtlaskitStack } from '@atlaskit/primitives/compiled';`,
		);
	});

	it('should transform mixed aliased and non-aliased imports', async () => {
		const input = `import { Box as AtlaskitBox, Stack, Inline as AtlaskitInline } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(
			`import { Box as AtlaskitBox, Stack, Inline as AtlaskitInline } from '@atlaskit/primitives/compiled';`,
		);
	});

	it('should NOT transform aliased imports when xcss is present', async () => {
		const input = `import { Box as AtlaskitBox, xcss } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box as AtlaskitBox, xcss } from '@atlaskit/primitives';`);
	});
});

describe('prop to xcss transformation', () => {
	it('should transform Grid props to xcss', async () => {
		const input = `
import { Grid } from '@atlaskit/primitives';

const MyComponent = () => (
	<Grid templateRows="auto 1fr" templateColumns="200px 1fr" />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { cssMap } from '@atlaskit/css';
import { Grid } from '@atlaskit/primitives/compiled';

const gridStyles = cssMap({
    root: {
        gridTemplateRows: "auto 1fr",
        gridTemplateColumns: "200px 1fr"
    }
});

const MyComponent = () => (
	<Grid xcss={gridStyles.root} />
);`);
	});

	it('should transform Anchor props to xcss', async () => {
		const input = `
import { Anchor } from '@atlaskit/primitives';

const MyComponent = () => (
	<Anchor backgroundColor="blue" padding="8px" paddingBlock="16px" />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { cssMap } from '@atlaskit/css';
import { Anchor } from '@atlaskit/primitives/compiled';

const anchorStyles = cssMap({
    root: {
        backgroundColor: "blue",
        padding: "8px",
        paddingBlock: "16px"
    }
});

const MyComponent = () => (
	<Anchor xcss={anchorStyles.root} />
);`);
	});

	it('should transform Pressable props to xcss', async () => {
		const input = `
import { Pressable } from '@atlaskit/primitives';

const MyComponent = () => (
	<Pressable backgroundColor="blue" padding="8px" paddingBlock="16px" />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { cssMap } from '@atlaskit/css';
import { Pressable } from '@atlaskit/primitives/compiled';

const pressableStyles = cssMap({
    root: {
        backgroundColor: "blue",
        padding: "8px",
        paddingBlock: "16px"
    }
});

const MyComponent = () => (
	<Pressable xcss={pressableStyles.root} />
);`);
	});

	it('should handle components with existing xcss prop', async () => {
		const input = `
import { Grid } from '@atlaskit/primitives';

const MyComponent = () => (
	<Grid templateRows="auto 1fr" xcss={{ color: 'red' }} />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { cssMap } from '@atlaskit/css';
import { Grid } from '@atlaskit/primitives/compiled';

const gridStyles = cssMap({
    root: {
        gridTemplateRows: "auto 1fr"
    }
});

const MyComponent = () => (
	<Grid xcss={[gridStyles.root, { color: 'red' }]} />
);`);
	});

	it('should handle existing cssMap import', async () => {
		const input = `
import { Grid } from '@atlaskit/primitives';
import { cssMap } from '@atlaskit/css';

const MyComponent = () => (
	<Grid templateRows="auto 1fr" />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Grid } from '@atlaskit/primitives/compiled';
import { cssMap } from '@atlaskit/css';

const gridStyles = cssMap({
    root: {
        gridTemplateRows: "auto 1fr"
    }
});

const MyComponent = () => (
	<Grid xcss={gridStyles.root} />
);`);
	});

	it('should handle aliased cssMap import', async () => {
		const input = `
import { Grid } from '@atlaskit/primitives';
import { cssMap as emotionCssMap } from '@atlaskit/css';

const MyComponent = () => (
	<Grid templateRows="auto 1fr" />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Grid } from '@atlaskit/primitives/compiled';
import { cssMap as emotionCssMap } from '@atlaskit/css';

const gridStyles = emotionCssMap({
    root: {
        gridTemplateRows: "auto 1fr"
    }
});

const MyComponent = () => (
	<Grid xcss={gridStyles.root} />
);`);
	});

	it('should handle multiple components in the same file', async () => {
		const input = `
import { Grid, Anchor } from '@atlaskit/primitives';

const gridStyles = cssMap({
    root: {
        templateRows: "auto 1fr"
    }
});

const anchorStyles = cssMap({
    root: {
        backgroundColor: "blue",
        padding: "8px"
    }
});

const MyComponent = () => (
	<>
		<Grid templateRows="auto 1fr" />
		<Anchor backgroundColor="blue" padding="8px" />
	</>
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { cssMap } from '@atlaskit/css';
import { Grid, Anchor } from '@atlaskit/primitives/compiled';

const gridStyles = cssMap({
    root: {
        templateRows: "auto 1fr"
    }
});

const anchorStyles = cssMap({
    root: {
        backgroundColor: "blue",
        padding: "8px"
    }
});

const MyComponent = () => (
	<>
		<Grid xcss={gridStyles.root} />
		<Anchor xcss={anchorStyles.root} />
	</>
);`);
	});

	it('should handle multiple components of same type in the same file', async () => {
		const input = `
import { Grid, Anchor } from '@atlaskit/primitives';

const gridStyles = cssMap({
    root: {
        gridTemplateRows: "auto 1fr"
    }
});

const MyComponent = () => (
	<>
		<Grid templateRows="auto 1fr" />
		<Grid templateRows="auto 1fr" />
	</>
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { cssMap } from '@atlaskit/css';
import { Grid, Anchor } from '@atlaskit/primitives/compiled';

const gridStyles = cssMap({
    root: {
        gridTemplateRows: "auto 1fr"
    }
});

const MyComponent = () => (
	<>
		<Grid xcss={gridStyles.root} />
		<Grid xcss={gridStyles.root} />
	</>
);`);
	});

	it('should preserve other props while transforming to xcss', async () => {
		const input = `
import { Grid } from '@atlaskit/primitives';

const gridStyles = cssMap({
	root: {
		gridTemplateRows: "auto 1fr"
	}
});

const MyComponent = () => (
	<Grid templateRows="auto 1fr" data-testid="my-grid" onClick={() => {}} />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { cssMap } from '@atlaskit/css';
import { Grid } from '@atlaskit/primitives/compiled';

const gridStyles = cssMap({
	root: {
		gridTemplateRows: "auto 1fr"
	}
});

const MyComponent = () => (
	<Grid data-testid="my-grid" onClick={() => {}} xcss={gridStyles.root} />
);`);
	});
});
