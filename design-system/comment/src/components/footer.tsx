import React, { type FC, type ReactNode } from 'react';

import WarningIcon from '@atlaskit/icon/core/migration/warning';
import Inline from '@atlaskit/primitives/inline';
import { Y500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

interface FooterProps {
	actions?: Array<ReactNode>;
	errorActions?: Array<ReactNode>;
	errorIconLabel?: string;
	isError?: boolean;
	isSaving?: boolean;
	testId?: string;
}

/**
 * __Footer items__
 *
 * The footer items in the comment. Usually reserved for error messages.
 *
 * @internal
 */
const Footer: FC<FooterProps> = ({
	actions = [],
	errorActions = [],
	errorIconLabel,
	isError,
	isSaving,
	testId,
}) => {
	if (isSaving || !(actions.length || errorActions.length)) {
		return null;
	}

	const items = isError ? errorActions : actions;

	return (
		<Inline alignBlock="center" shouldWrap testId={testId} space="space.100" separator="·">
			{isError && (
				<WarningIcon
					spacing="spacious"
					color={token('color.icon.warning', Y500)}
					label={errorIconLabel ? errorIconLabel : ''}
				/>
			)}
			{items.map((item, key) => Object.assign({}, item, { key }))}
		</Inline>
	);
};

Footer.displayName = 'CommentFooter';

export default Footer;
