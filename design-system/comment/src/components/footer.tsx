import React, { type FC, type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import { Flex } from '@atlaskit/primitives/compiled';
import Inline from '@atlaskit/primitives/inline';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

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
				<Flex xcss={iconSpacingStyles.space050}>
					<WarningIcon
						color={token('color.icon.warning')}
						label={errorIconLabel ? errorIconLabel : ''}
					/>
				</Flex>
			)}
			{items.map((item, key) => Object.assign({}, item, { key }))}
		</Inline>
	);
};

Footer.displayName = 'CommentFooter';

export default Footer;
