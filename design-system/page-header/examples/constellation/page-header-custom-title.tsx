/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import __noop from '@atlaskit/ds-lib/noop';
import InlineEdit from '@atlaskit/inline-edit';
import PageHeader from '@atlaskit/page-header';
import { token } from '@atlaskit/tokens';

const readViewStyles = css({
	display: 'flex',
	maxWidth: '100%',
	padding: `${token('space.100', '8px')} ${token('space.075', '6px')}`,
	font: token('font.heading.large'),
	overflow: 'hidden',
});

const editViewStyles = css({
	boxSizing: 'border-box',
	width: '100%',
	padding: `${token('space.075', '6px')} ${token('space.075', '6px')}`,

	border: `2px solid ${token('color.border')}`,
	borderRadius: '3px',
	cursor: 'inherit',
	font: token('font.heading.large'),
	outline: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':focus': {
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
