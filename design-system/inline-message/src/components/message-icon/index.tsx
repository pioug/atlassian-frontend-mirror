/** @jsx jsx */
import type { CSSProperties, FC } from 'react';

import { css, jsx } from '@emotion/react';

import { B400, G300, P300, R400, Y300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { typesMapping } from '../../constants';
import type { IconAppearance } from '../../types';

interface MessageIconProps {
	appearance: IconAppearance;
	isOpen: boolean;
	label?: string;
}

const iconColor = (appearance: IconAppearance) => {
	switch (appearance) {
		case 'connectivity':
			return token('color.icon.brand', B400);
		case 'confirmation':
			return token('color.icon.success', G300);
		case 'info':
			return token('color.icon.discovery', P300);
		case 'warning':
			return token('color.icon.warning', Y300);
		case 'error':
			return token('color.icon.danger', R400);
	}
};

const iconWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	flex: '0 0 auto',
	color: 'var(--icon-color)',
});

const iconColorStyles = css({
	color: 'var(--icon-accent-color)',
});

/**
 * __Selected icon__
 *
 * The selected icon is used as the primary interactive element for the dialog.
 * Can be used with or without supporting text.
 */
const SelectedIcon: FC<MessageIconProps> = ({ appearance, isOpen, label }) => {
	const {
		[appearance]: { icon: Icon, defaultLabel },
	} = typesMapping;

	return (
		<span
			data-ds--inline-message--icon
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			style={{ '--icon-color': iconColor(appearance) } as CSSProperties}
			css={[iconWrapperStyles, isOpen && iconColorStyles]}
		>
			<Icon testId="inline-message-icon" label={label || defaultLabel} size="medium" />
		</span>
	);
};

export default SelectedIcon;
