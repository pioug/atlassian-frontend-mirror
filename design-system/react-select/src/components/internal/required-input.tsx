/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FocusEventHandler, type FunctionComponent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import __noop from '@atlaskit/ds-lib/noop';

const styles = css({
	width: '100%',
	position: 'absolute',
	insetBlockEnd: 0,
	insetInlineEnd: 0,
	insetInlineStart: 0,
	label: 'requiredInput',
	opacity: 0,
	pointerEvents: 'none',
});

const RequiredInput: FunctionComponent<{
	readonly name?: string;
	readonly onFocus: FocusEventHandler<HTMLInputElement>;
}> = ({ name, onFocus }) => (
	<input
		required
		name={name}
		tabIndex={-1}
		aria-hidden="true"
		onFocus={onFocus}
		css={styles}
		// Prevent `Switching from uncontrolled to controlled` error
		value=""
		onChange={__noop}
	/>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default RequiredInput;
