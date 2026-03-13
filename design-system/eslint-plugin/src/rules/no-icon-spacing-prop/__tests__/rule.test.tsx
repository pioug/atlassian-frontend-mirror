import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-icon-spacing-prop', rule, {
	valid: [
		// Icon without spacing prop — no error
		`
			import AddIcon from '@atlaskit/icon/core/add';
			<AddIcon label="Add" color="currentColor" />
		`,
		// Non-icon component with spacing prop — no error
		`
			import Button from '@atlaskit/button/new';
			<Button spacing="compact">Click</Button>
		`,
		// Icon passed as reference (not JSX) — no error
		`
			import AddIcon from '@atlaskit/icon/core/add';
			import Button from '@atlaskit/button/new';
			<Button iconBefore={AddIcon} />
		`,
	],
	invalid: [
		// spacing="spacious" on medium icon
		{
			code: `
				import AddIcon from '@atlaskit/icon/core/add';
				<AddIcon label="Add" spacing="spacious" color="currentColor" />
			`,
			errors: [
				{
					messageId: 'noSpacingProp',
					suggestions: [
						{
							messageId: 'suggestWrapInBox',
							output: `
				import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import AddIcon from '@atlaskit/icon/core/add';
const iconSpacingStyles = cssMap({
  space050: { paddingTop: token('space.050'), paddingRight: token('space.050'), paddingBottom: token('space.050'), paddingLeft: token('space.050') },
});
				<Box xcss={iconSpacingStyles.space050}><AddIcon label="Add"  color="currentColor" /></Box>
			`,
						},
					],
				},
			],
		},
		// spacing="compact" on medium icon
		{
			code: `
				import AddIcon from '@atlaskit/icon/core/add';
				<AddIcon label="Add" spacing="compact" color="currentColor" />
			`,
			errors: [
				{
					messageId: 'noSpacingProp',
					suggestions: [
						{
							messageId: 'suggestWrapInBox',
							output: `
				import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import AddIcon from '@atlaskit/icon/core/add';
const iconSpacingStyles = cssMap({
  space050: { paddingTop: token('space.050'), paddingRight: token('space.050'), paddingBottom: token('space.050'), paddingLeft: token('space.050') },
});
				<Box xcss={iconSpacingStyles.space050}><AddIcon label="Add"  color="currentColor" /></Box>
			`,
						},
					],
				},
			],
		},
		// spacing="none" → suggest remove the prop only
		{
			code: `
				import AddIcon from '@atlaskit/icon/core/add';
				<AddIcon label="Add" spacing="none" color="currentColor" />
			`,
			errors: [
				{
					messageId: 'noSpacingProp',
					suggestions: [
						{
							messageId: 'suggestRemoveSpacing',
							output: `
				import AddIcon from '@atlaskit/icon/core/add';
				<AddIcon label="Add"  color="currentColor" />
			`,
						},
					],
				},
			],
		},
		// spacing="spacious" on small icon → space075
		{
			code: `
				import ChevronIcon from '@atlaskit/icon/core/chevron-right';
				<ChevronIcon label="" spacing="spacious" size="small" color="currentColor" />
			`,
			errors: [
				{
					messageId: 'noSpacingProp',
					suggestions: [
						{
							messageId: 'suggestWrapInBox',
							output: `
				import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import ChevronIcon from '@atlaskit/icon/core/chevron-right';
const iconSpacingStyles = cssMap({
  space075: { paddingTop: token('space.075'), paddingRight: token('space.075'), paddingBottom: token('space.075'), paddingLeft: token('space.075') },
});
				<Box xcss={iconSpacingStyles.space075}><ChevronIcon label=""  size="small" color="currentColor" /></Box>
			`,
						},
					],
				},
			],
		},
		// spacing="compact" on small icon → space025
		{
			code: `
				import ChevronIcon from '@atlaskit/icon/core/chevron-right';
				<ChevronIcon label="" spacing="compact" size="small" color="currentColor" />
			`,
			errors: [
				{
					messageId: 'noSpacingProp',
					suggestions: [
						{
							messageId: 'suggestWrapInBox',
							output: `
				import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import ChevronIcon from '@atlaskit/icon/core/chevron-right';
const iconSpacingStyles = cssMap({
  space025: { paddingTop: token('space.025'), paddingRight: token('space.025'), paddingBottom: token('space.025'), paddingLeft: token('space.025') },
});
				<Box xcss={iconSpacingStyles.space025}><ChevronIcon label=""  size="small" color="currentColor" /></Box>
			`,
						},
					],
				},
			],
		},
		// icon-lab icon
		{
			code: `
				import LabIcon from '@atlaskit/icon-lab/core/test';
				<LabIcon label="Lab" spacing="spacious" color="currentColor" />
			`,
			errors: [
				{
					messageId: 'noSpacingProp',
					suggestions: [
						{
							messageId: 'suggestWrapInBox',
							output: `
				import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import LabIcon from '@atlaskit/icon-lab/core/test';
const iconSpacingStyles = cssMap({
  space050: { paddingTop: token('space.050'), paddingRight: token('space.050'), paddingBottom: token('space.050'), paddingLeft: token('space.050') },
});
				<Box xcss={iconSpacingStyles.space050}><LabIcon label="Lab"  color="currentColor" /></Box>
			`,
						},
					],
				},
			],
		},
		// private icon
		{
			code: `
				import PrivateIcon from '@atlassian/icon-private/core/test';
				<PrivateIcon label="Private" spacing="compact" color="currentColor" />
			`,
			errors: [
				{
					messageId: 'noSpacingProp',
					suggestions: [
						{
							messageId: 'suggestWrapInBox',
							output: `
				import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import PrivateIcon from '@atlassian/icon-private/core/test';
const iconSpacingStyles = cssMap({
  space050: { paddingTop: token('space.050'), paddingRight: token('space.050'), paddingBottom: token('space.050'), paddingLeft: token('space.050') },
});
				<Box xcss={iconSpacingStyles.space050}><PrivateIcon label="Private"  color="currentColor" /></Box>
			`,
						},
					],
				},
			],
		},
		// Existing Box from compiled — add cssMap/jsx, keep Box, add token + pragma
		{
			code: `
				import { Box } from '@atlaskit/primitives/compiled';
				import AddIcon from '@atlaskit/icon/core/add';
				<AddIcon label="Add" spacing="spacious" color="currentColor" />
			`,
			errors: [
				{
					messageId: 'noSpacingProp',
					suggestions: [
						{
							messageId: 'suggestWrapInBox',
							output: `
				import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Box } from '@atlaskit/primitives/compiled';
				import AddIcon from '@atlaskit/icon/core/add';
const iconSpacingStyles = cssMap({
  space050: { paddingTop: token('space.050'), paddingRight: token('space.050'), paddingBottom: token('space.050'), paddingLeft: token('space.050') },
});
				<Box xcss={iconSpacingStyles.space050}><AddIcon label="Add"  color="currentColor" /></Box>
			`,
						},
					],
				},
			],
		},
		// Box from non-compiled — migrate path to /compiled
		{
			code: `
				import { Box } from '@atlaskit/primitives';
				import AddIcon from '@atlaskit/icon/core/add';
				<AddIcon label="Add" spacing="spacious" color="currentColor" />
			`,
			errors: [
				{
					messageId: 'noSpacingProp',
					suggestions: [
						{
							messageId: 'suggestWrapInBox',
							output: `
				import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Box } from '@atlaskit/primitives/compiled';
				import AddIcon from '@atlaskit/icon/core/add';
const iconSpacingStyles = cssMap({
  space050: { paddingTop: token('space.050'), paddingRight: token('space.050'), paddingBottom: token('space.050'), paddingLeft: token('space.050') },
});
				<Box xcss={iconSpacingStyles.space050}><AddIcon label="Add"  color="currentColor" /></Box>
			`,
						},
					],
				},
			],
		},
		// Stack from @atlaskit/primitives — add Box, migrate path to /compiled
		{
			code: `
				import { Stack } from '@atlaskit/primitives';
				import AddIcon from '@atlaskit/icon/core/add';
				<AddIcon label="Add" spacing="spacious" color="currentColor" />
			`,
			errors: [
				{
					messageId: 'noSpacingProp',
					suggestions: [
						{
							messageId: 'suggestWrapInBox',
							output: `
				import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Stack, Box } from '@atlaskit/primitives/compiled';
				import AddIcon from '@atlaskit/icon/core/add';
const iconSpacingStyles = cssMap({
  space050: { paddingTop: token('space.050'), paddingRight: token('space.050'), paddingBottom: token('space.050'), paddingLeft: token('space.050') },
});
				<Box xcss={iconSpacingStyles.space050}><AddIcon label="Add"  color="currentColor" /></Box>
			`,
						},
					],
				},
			],
		},
		// Spread props — no suggestion
		{
			code: `
				import AddIcon from '@atlaskit/icon/core/add';
				<AddIcon {...iconProps} spacing="spacious" color="currentColor" />
			`,
			errors: [{ messageId: 'noSpacingPropManual' }],
		},
		// Dynamic spacing — no suggestion
		{
			code: `
				import AddIcon from '@atlaskit/icon/core/add';
				<AddIcon label="Add" spacing={spacingValue} color="currentColor" />
			`,
			errors: [{ messageId: 'noSpacingPropManual' }],
		},
		// Multiple icons — both flagged
		{
			code: `
				import AddIcon from '@atlaskit/icon/core/add';
				import EditIcon from '@atlaskit/icon/core/edit';
				<>
					<AddIcon label="Add" spacing="spacious" color="currentColor" />
					<EditIcon label="Edit" spacing="compact" color="currentColor" />
				</>
			`,
			errors: [
				{
					messageId: 'noSpacingProp',
					suggestions: [
						{
							messageId: 'suggestWrapInBox',
							output: `
				import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import AddIcon from '@atlaskit/icon/core/add';
				import EditIcon from '@atlaskit/icon/core/edit';
const iconSpacingStyles = cssMap({
  space050: { paddingTop: token('space.050'), paddingRight: token('space.050'), paddingBottom: token('space.050'), paddingLeft: token('space.050') },
});
				<>
					<Box xcss={iconSpacingStyles.space050}><AddIcon label="Add"  color="currentColor" /></Box>
					<EditIcon label="Edit" spacing="compact" color="currentColor" />
				</>
			`,
						},
					],
				},
				{
					messageId: 'noSpacingProp',
					suggestions: [
						{
							messageId: 'suggestWrapInBox',
							output: `
				import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import AddIcon from '@atlaskit/icon/core/add';
				import EditIcon from '@atlaskit/icon/core/edit';
const iconSpacingStyles = cssMap({
  space050: { paddingTop: token('space.050'), paddingRight: token('space.050'), paddingBottom: token('space.050'), paddingLeft: token('space.050') },
});
				<>
					<AddIcon label="Add" spacing="spacious" color="currentColor" />
					<Box xcss={iconSpacingStyles.space050}><EditIcon label="Edit"  color="currentColor" /></Box>
				</>
			`,
						},
					],
				},
			],
		},
		// Icon in render prop
		{
			code: `
				import AddIcon from '@atlaskit/icon/core/add';
				import Button from '@atlaskit/button/new';
				<Button iconBefore={() => <AddIcon label="" spacing="spacious" />} />
			`,
			errors: [
				{
					messageId: 'noSpacingProp',
					suggestions: [
						{
							messageId: 'suggestWrapInBox',
							output: `
				import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import AddIcon from '@atlaskit/icon/core/add';
				import Button from '@atlaskit/button/new';
const iconSpacingStyles = cssMap({
  space050: { paddingTop: token('space.050'), paddingRight: token('space.050'), paddingBottom: token('space.050'), paddingLeft: token('space.050') },
});
				<Button iconBefore={() => <Box xcss={iconSpacingStyles.space050}><AddIcon label=""  /></Box>} />
			`,
						},
					],
				},
			],
		},
	],
});
