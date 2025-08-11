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
	paddingBlockEnd: token('space.100'),
	paddingBlockStart: token('space.100'),
	paddingInlineEnd: token('space.075'),
	paddingInlineStart: token('space.075'),
});

const editViewStyles = css({
	boxSizing: 'border-box',
	width: '100%',
	border: `2px solid ${token('color.border')}`,
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('border.radius.100', '3px'),
	cursor: 'inherit',
	font: token('font.heading.large'),
	outline: 'none',
	paddingBlockEnd: token('space.075'),
	paddingBlockStart: token('space.075'),
	paddingInlineEnd: token('space.075'),
	paddingInlineStart: token('space.075'),
	'&:focus': {
		border: `2px solid ${token('color.border.focused')}`,
	},
});

const CustomTitleComponent = () => {
	return (
		<InlineEdit
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
