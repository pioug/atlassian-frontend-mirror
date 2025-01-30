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
	// TODO (AFB-874): Disabling due to fixing for expand-spacing-property produces further ESLint errors
	// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
	padding: `${token('space.100', '8px')} ${token('space.075', '6px')}`,
	font: token('font.heading.large'),
	overflow: 'hidden',
});

const editViewStyles = css({
	boxSizing: 'border-box',
	width: '100%',
	// TODO (AFB-874): Disabling due to fixing for expand-spacing-property produces further ESLint errors
	// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
	padding: `${token('space.075', '6px')} ${token('space.075', '6px')}`,
	border: `2px solid ${token('color.border')}`,
	borderRadius: token('border.radius', '3px'),
	cursor: 'inherit',
	font: token('font.heading.large'),
	outline: 'none',
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
