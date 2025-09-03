/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import __noop from '@atlaskit/ds-lib/noop';
import InlineEdit from '@atlaskit/inline-edit';
import PageHeader from '@atlaskit/page-header';
import { token } from '@atlaskit/tokens';

const readViewStyles = css({
	display: 'flex',
	maxWidth: '100%',
	font: token('font.heading.large'),
	overflow: 'hidden',
	paddingBlockEnd: token('space.100', '8px'),
	paddingBlockStart: token('space.100', '8px'),
	paddingInlineEnd: token('space.075', '6px'),
	paddingInlineStart: token('space.075', '6px'),
});

const editViewStyles = css({
	boxSizing: 'border-box',
	width: '100%',
	border: `2px solid ${token('color.border')}`,
	borderRadius: token('radius.small', '3px'),
	cursor: 'inherit',
	font: token('font.heading.large'),
	outline: 'none',
	paddingBlockEnd: token('space.075', '6px'),
	paddingBlockStart: token('space.075', '6px'),
	paddingInlineEnd: token('space.075', '6px'),
	paddingInlineStart: token('space.075', '6px'),
	'&:focus': {
		border: `2px solid ${token('color.border.focused')}`,
	},
});

const CustomTitleComponent = () => {
	return (
		<InlineEdit
			testId="custom-title"
			readView={() => <div css={readViewStyles}>Editable title</div>}
			editView={(props, ref) => <input css={editViewStyles} {...props} ref={ref} />}
			defaultValue="Editable title"
			onConfirm={__noop}
		/>
	);
};

const PageHeaderCustomTitleExample = () => {
	return (
		<PageHeader disableTitleStyles>
			<CustomTitleComponent />
		</PageHeader>
	);
};

export default PageHeaderCustomTitleExample;
