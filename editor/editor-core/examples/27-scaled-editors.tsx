/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { default as FullPageExample } from './5-full-page';

const user = xcss({
	width: '100%',
	display: 'flex',
	alignItems: 'center',
});

const avatar = xcss({
	marginRight: 'space.050',
	borderRadius: 'radius.full',
	height: '24px',
	width: '24px',
});
const Author = () => (
	<Box xcss={user}>
		{/* eslint-disable-next-line jsx-a11y/alt-text */}
		<Box as="img" xcss={avatar} src="https://i.imgur.com/zJi8dw9.jpg"></Box>
		<Box as="span">Philip J. Fry</Box>
	</Box>
);

const frame = xcss({
	display: 'flex',
	flexDirection: 'column',
	width: '280px',
	boxSizing: 'content-box',
	maxWidth: '280px',
	paddingInline: 'space.200',
	paddingBlock: 'space.150',
	border: `1px solid ${token('color.border')}`,
	borderRadius: 'radius.small',
	boxShadow: 'elevation.shadow.overlay',
	justifyContent: 'space-between',
});

const editorWrapper = css({
	padding: token('space.100', '8px'),
	backgroundColor: 'white',
	border: `1px solid ${token('color.border')}`,
	borderRadius: '4px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror': {
		minHeight: '125px',
	},
});

const InlineCommentEditor = (props: { editor: React.ReactNode }) => (
	<Stack xcss={frame} space="space.150">
		<Author />
		<div css={editorWrapper}>{props.editor}</div>
		<Inline alignInline="end">
			<Button appearance="primary">Save</Button>
		</Inline>
	</Stack>
);

const editor = (
	<FullPageExample
		editorProps={{
			appearance: 'chromeless',
			placeholder: '',
			contentComponents: undefined,
			disabled: false,
		}}
	/>
);

const ScaledEditorsExample = () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<Box padding="space.250">
		<InlineCommentEditor editor={editor} />
	</Box>
);

export default ScaledEditorsExample;
