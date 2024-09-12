/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { components } from 'react-select';

import LegacySelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import CrossIcon from '@atlaskit/icon/utility/cross';
import { fg } from '@atlaskit/platform-feature-flags';
import { Inline, xcss } from '@atlaskit/primitives';

import { type MultiValueRemoveProps } from '../types';

export { ClearIndicator, DropdownIndicator, LoadingIndicator } from './indicators';

const disabledStyles = css({
	display: 'none',
});

const enabledStyles = css({
	display: 'inherit',
});

const iconWrapperStyles = xcss({
	padding: 'space.025',
});

/**
 * __Multi value remove__
 *
 * The icon used to remove individual selections from a multi-select.
 *
 */
export const MultiValueRemove = (props: MultiValueRemoveProps<any>) => {
	const { isDisabled } = props.selectProps;

	const renderIcon = () => {
		// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
		if (fg('platform-component-visual-refresh')) {
			return <CrossIcon label="Clear" color="currentColor" />;
		}

		// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
		if (fg('platform-visual-refresh-icons-legacy-facade')) {
			return (
				<Inline xcss={iconWrapperStyles}>
					<CrossIcon label="Clear" color="currentColor" />
				</Inline>
			);
		}

		return (
			// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
			<LegacySelectClearIcon
				label="Clear"
				primaryColor="transparent"
				size="small"
				secondaryColor="inherit"
			/>
		);
	};

	return (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		<components.MultiValueRemove {...props}>
			<div
				css={isDisabled ? disabledStyles : enabledStyles}
				data-testid={isDisabled ? 'hide-clear-icon' : 'show-clear-icon'}
			>
				{renderIcon()}
			</div>
		</components.MultiValueRemove>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const IndicatorSeparator = null;
