/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';
import React from 'react';

// The example sizes the editor-owned ProseMirror descendant.
// These styles require selectors or values outside @atlaskit/css.
import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { token } from '@atlaskit/tokens';

import { default as FullPageExample } from './5-full-page';

const styles = cssMap({
	user: {
		width: '100%',
		display: 'flex',
		alignItems: 'center',
	},
	avatar: {
		marginRight: token('space.050'),
		borderRadius: token('radius.full'),
		height: '24px',
		width: '24px',
	},
});

const frameStyles = css({
	width: '280px',
	boxSizing: 'content-box',
	maxWidth: '280px',
	paddingInline: token('space.200'),
	paddingBlock: token('space.150'),
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: token('color.border'),
	borderRadius: token('radius.small'),
	boxShadow: token('elevation.shadow.overlay'),
});

const Author = () => (
	<Box xcss={styles.user}>
		<img css={styles.avatar} src="https://i.imgur.com/zJi8dw9.jpg" alt="Author avatar" />
		<Box as="span">Philip J. Fry</Box>
	</Box>
);

const editorWrapper = css({
	paddingTop: token('space.100'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
	backgroundColor: 'white',
	border: `${token('border.width')} solid ${token('color.border')}`,
	borderRadius: token('radius.small'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror': {
		minHeight: '125px',
	},
});

const InlineCommentEditor = (props: { editor: React.ReactNode }) => (
	<div css={frameStyles}>
		<Stack space="space.150" spread="space-between">
			<Author />
			<div css={editorWrapper}>{props.editor}</div>
			<Inline alignInline="end">
				<Button appearance="primary">Save</Button>
			</Inline>
		</Stack>
	</div>
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

const ScaledEditorsExample = (): JSX.Element => (
	<Box padding="space.250">
		<InlineCommentEditor editor={editor} />
	</Box>
);

export default ScaledEditorsExample;
