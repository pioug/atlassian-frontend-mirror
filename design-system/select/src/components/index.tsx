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
import { token } from '@atlaskit/tokens';

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

	return (
		<components.MultiValueRemove {...props}>
			<div
				css={isDisabled ? disabledStyles : enabledStyles}
				data-testid={isDisabled ? 'hide-clear-icon' : 'show-clear-icon'}
			>
				{fg('platform-component-visual-refresh') ? (
					// eslint-disable-next-line @atlaskit/design-system/ensure-icon-color
					<CrossIcon label="Clear" />
				) : (
					<Inline xcss={iconWrapperStyles}>
						<CrossIcon
							label="Clear"
							color="currentColor"
							LEGACY_fallbackIcon={LegacySelectClearIcon}
							LEGACY_size="small"
							LEGACY_primaryColor="transparent"
							LEGACY_secondaryColor="inherit"
							LEGACY_margin={token('space.negative.025')}
						/>
					</Inline>
				)}
			</div>
		</components.MultiValueRemove>
	);
};

export const IndicatorSeparator = null;
