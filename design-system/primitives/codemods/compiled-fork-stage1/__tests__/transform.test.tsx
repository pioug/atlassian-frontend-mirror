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

	it('should transform named imports with multiple specifiers', async () => {
		const input = `import { Box, Stack, Inline } from '@atlaskit/primitives';`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box, Stack, Inline } from '@atlaskit/primitives/compiled';`);
	});

	it('should transform Flex component without xcss', async () => {
		const input = `
import { Flex } from '@atlaskit/primitives';

const MyComponent = () => (
	<Flex backgroundColor="color.background.neutral" padding="space.600" />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { token } from '@atlaskit/tokens';
import { cssMap } from '@atlaskit/css';
import { Flex } from '@atlaskit/primitives/compiled';

const flexStyles = cssMap({
    root: {
        backgroundColor: token("color.background.neutral"),
        padding: token("space.600")
    }
});

const MyComponent = () => (
	<Flex xcss={flexStyles.root} />
);`);
	});

	it('should transform Stack component without xcss', async () => {
		const input = `
import { Stack } from '@atlaskit/primitives';

const MyComponent = () => (
	<Stack backgroundColor="color.background.neutral" padding="space.600" />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { token } from '@atlaskit/tokens';
import { cssMap } from '@atlaskit/css';
import { Stack } from '@atlaskit/primitives/compiled';

const stackStyles = cssMap({
    root: {
        backgroundColor: token("color.background.neutral"),
        padding: token("space.600")
    }
});

const MyComponent = () => (
	<Stack xcss={stackStyles.root} />
);`);
	});

	it('should transform Inline component without xcss', async () => {
		const input = `
import { Inline } from '@atlaskit/primitives';

const MyComponent = () => (
	<Inline backgroundColor="color.background.neutral" padding="space.600" />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { token } from '@atlaskit/tokens';
import { cssMap } from '@atlaskit/css';
import { Inline } from '@atlaskit/primitives/compiled';

const inlineStyles = cssMap({
    root: {
        backgroundColor: token("color.background.neutral"),
        padding: token("space.600")
    }
});

const MyComponent = () => (
	<Inline xcss={inlineStyles.root} />
);`);
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

	it('should NOT transform the file when media is imported', async () => {
		const input = `import { media, Box, xcss } from '@atlaskit/primitives';

const imageStyles = xcss({
	width: '100%',
	[media.above.md]: {
		width: '125%',
	},
});

const MyComponent = () => (
	<Box xcss={imageStyles} />
);`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(input);
	});

	it('should transform Grid props without token()', async () => {
		const input = `
import { Grid } from '@atlaskit/primitives';

const MyComponent = () => (
	<Grid templateRows="auto 1fr" templateColumns="1fr 2fr" />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { cssMap } from '@atlaskit/css';
import { Grid } from '@atlaskit/primitives/compiled';

const gridStyles = cssMap({
    root: {
        gridTemplateRows: "auto 1fr",
        gridTemplateColumns: "1fr 2fr"
    }
});

const MyComponent = () => (
	<Grid xcss={gridStyles.root} />
);`);
	});

	it('should transform mixed Grid and non-Grid props correctly', async () => {
		const input = `
import { Grid } from '@atlaskit/primitives';

const MyComponent = () => (
	<Grid templateRows="auto 1fr" backgroundColor="color.background.neutral" padding="space.600" />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { token } from '@atlaskit/tokens';
import { cssMap } from '@atlaskit/css';
import { Grid } from '@atlaskit/primitives/compiled';

const gridStyles = cssMap({
    root: {
        gridTemplateRows: "auto 1fr",
        backgroundColor: token("color.background.neutral"),
        padding: token("space.600")
    }
});

const MyComponent = () => (
	<Grid xcss={gridStyles.root} />
);`);
	});

	it('should NOT transform  the file when XCSS type is imported', async () => {
		const input = `import { XCSS } from '@atlaskit/primitives';
export interface Props { yo: XCSS; }`;

		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { XCSS } from '@atlaskit/primitives/compiled';
export interface Props { yo: XCSS; }`);
	});

	it('should NOT transform other imports', async () => {
		const input = `
import { Box, Stack } from '@atlaskit/primitives';
import { something } from '@atlaskit/other-package';
		`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Box, Stack } from '@atlaskit/primitives/compiled';
import { something } from '@atlaskit/other-package';`);
	});

	it('should NOT transform Box primitives with spread props', async () => {
		const input = `import { Box } from '@atlaskit/primitives';
const MyComponent = (props: any) => <Box {...props} />`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(input);
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
		expect(output).toEqual(input);
	});

	it('should transform renamed primitive components', async () => {
		const input = `
import { Box as MyBox, Stack as MyStack } from '@atlaskit/primitives';

const MyComponent = () => (
	<>
		<MyBox backgroundColor="color.background.neutral" padding="space.600" />
		<MyStack backgroundColor="color.background.neutral" padding="space.600" />
	</>
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { token } from '@atlaskit/tokens';
import { cssMap } from '@atlaskit/css';
import { Box as MyBox, Stack as MyStack } from '@atlaskit/primitives/compiled';

const mystackStyles = cssMap({
    root: {
        backgroundColor: token("color.background.neutral"),
        padding: token("space.600")
    }
});

const myboxStyles = cssMap({
    root: {
        backgroundColor: token("color.background.neutral"),
        padding: token("space.600")
    }
});

const MyComponent = () => (
	<>
		<MyBox xcss={myboxStyles.root} />
		<MyStack xcss={mystackStyles.root} />
	</>
);`);
	});

	it('should NOT transform imports when some components have xcss and others do not', async () => {
		const input = `import { Box } from '@atlaskit/primitives';

const MyComponent = () => (
	<>
		<Box xcss={{ color: 'red' }}>With xcss</Box>
		<Box backgroundColor="blue">Without xcss</Box>
	</>
);`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(input);
	});

	it('should NOT transform imports when some components have xcss and others do not (with multiple types)', async () => {
		const input = `import { Box, Stack } from '@atlaskit/primitives';

const MyComponent = () => (
	<>
		<Box xcss={{ color: 'red' }}>With xcss</Box>
		<Box backgroundColor="blue">Without xcss</Box>
		<Stack xcss={{ padding: '8px' }}>With xcss</Stack>
		<Stack backgroundColor="red">Without xcss</Stack>
	</>
);`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(input);
	});

	it('should NOT transform imports when some components have xcss and others do not (with renamed imports)', async () => {
		const input = `import { Box as MyBox, Stack as MyStack } from '@atlaskit/primitives';

const MyComponent = () => (
	<>
		<MyBox xcss={{ color: 'red' }}>With xcss</MyBox>
		<MyBox backgroundColor="blue">Without xcss</MyBox>
		<MyStack xcss={{ padding: '8px' }}>With xcss</MyStack>
		<MyStack backgroundColor="red">Without xcss</MyStack>
	</>
);`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(input);
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
	<Anchor backgroundColor="color.background.neutral" padding="space.600" paddingBlock="space.600" />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { token } from '@atlaskit/tokens';
import { cssMap } from '@atlaskit/css';
import { Anchor } from '@atlaskit/primitives/compiled';

const anchorStyles = cssMap({
    root: {
        backgroundColor: token("color.background.neutral"),
        padding: token("space.600"),
        paddingBlock: token("space.600")
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
	<Pressable backgroundColor="color.background.neutral" padding="space.600" paddingBlock="space.600" />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { token } from '@atlaskit/tokens';
import { cssMap } from '@atlaskit/css';
import { Pressable } from '@atlaskit/primitives/compiled';

const pressableStyles = cssMap({
    root: {
        backgroundColor: token("color.background.neutral"),
        padding: token("space.600"),
        paddingBlock: token("space.600")
    }
});

const MyComponent = () => (
	<Pressable xcss={pressableStyles.root} />
);`);
	});

	it('should handle components with existing xcss prop', async () => {
		const input = `import { Grid } from '@atlaskit/primitives';

const MyComponent = () => (
	<Grid templateRows="auto 1fr" xcss={{ color: 'red' }} />
);`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(input);
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
import { cssMap as compiledCssMap } from '@atlaskit/css';

const MyComponent = () => (
	<Grid templateRows="auto 1fr" />
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { Grid } from '@atlaskit/primitives/compiled';
import { cssMap as compiledCssMap } from '@atlaskit/css';

const gridStyles = compiledCssMap({
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

const MyComponent = () => (
	<>
		<Grid templateRows="auto 1fr" />
		<Anchor backgroundColor="color.background.neutral" padding="space.600" />
	</>
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { token } from '@atlaskit/tokens';
import { cssMap } from '@atlaskit/css';
import { Grid, Anchor } from '@atlaskit/primitives/compiled';

const anchorStyles = cssMap({
    root: {
        backgroundColor: token("color.background.neutral"),
        padding: token("space.600")
    }
});

const gridStyles = cssMap({
    root: {
        gridTemplateRows: "auto 1fr"
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

	it('should transform file with mixed imports and component usage', async () => {
		const input = `import React from 'react';
import { Box, Inline, Text, xcss } from '@atlaskit/primitives';

const MyComponent = () => (
	<>
		<Inline space="space.150" alignBlock="center">
			<Box xcss={iconWrapper}>Icon</Box>
			<Text>Content</Text>
		</Inline>
		<Box xcss={actionStyles}>Main content</Box>
	</>
);

const actionStyles = xcss({
	width: '100%',
});

const iconWrapper = xcss({
	padding: 'space.050',
	borderRadius: 'radius.small',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: 'color.background.brand.subtlest',
});

export default MyComponent;`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import React from 'react';
import { xcss, Box } from '@atlaskit/primitives';

import { Inline, Text } from '@atlaskit/primitives/compiled';

const MyComponent = () => (
	<>
		<Inline space="space.150" alignBlock="center">
			<Box xcss={iconWrapper}>Icon</Box>
			<Text>Content</Text>
		</Inline>
		<Box xcss={actionStyles}>Main content</Box>
	</>
);

const actionStyles = xcss({
	width: '100%',
});

const iconWrapper = xcss({
	padding: 'space.050',
	borderRadius: 'radius.small',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: 'color.background.brand.subtlest',
});

export default MyComponent;`);
	});

	it('should transform props to use token() in cssMap', async () => {
		const input = `
import { Box } from '@atlaskit/primitives';

const MyComponent = () => (
	<Box paddingBlockStart="space.100" paddingInline="space.150">
		Content
	</Box>
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { token } from '@atlaskit/tokens';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

const boxStyles = cssMap({
    root: {
        paddingBlockStart: token("space.100"),
        paddingInline: token("space.150")
    }
});

const MyComponent = () => (
	<Box xcss={boxStyles.root}>
		Content
	</Box>
);`);
	});

	it('should transform multiple components with token() in cssMap', async () => {
		const input = `
import { Box, Inline } from '@atlaskit/primitives';

const MyComponent = () => (
	<Box paddingBlockStart="space.100">
		<Inline paddingInline="space.150">
			Content
		</Inline>
	</Box>
);
`;
		const output = await applyTransform(transform, input);
		expect(output).toEqual(`import { token } from '@atlaskit/tokens';
import { cssMap } from '@atlaskit/css';
import { Box, Inline } from '@atlaskit/primitives/compiled';

const inlineStyles = cssMap({
    root: {
        paddingInline: token("space.150")
    }
});

const boxStyles = cssMap({
    root: {
        paddingBlockStart: token("space.100")
    }
});

const MyComponent = () => (
	<Box xcss={boxStyles.root}>
		<Inline xcss={inlineStyles.root}>
			Content
		</Inline>
	</Box>
);`);
	});
});
