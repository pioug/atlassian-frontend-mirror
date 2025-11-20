import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { cssMap, cx } from '@atlaskit/css';
import { Box, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { InternalActionName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';

const styles = cssMap({
	button: {
		display: 'contents',
	},
	padding: {
		paddingInline: token('space.150'),
	},
	message: {
		paddingBlock: token('space.0'),
		paddingInline: token('space.0'),
	},
});

const UnresolvedAction = ({
	testId = 'unresolved-action',
	hasPadding = false,
}: {
	hasPadding?: boolean;
	testId?: string;
}): React.JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context?.actions?.[InternalActionName.UnresolvedAction];
	if (!data) {
		return null;
	}

	const { descriptor, onClick, values } = data;
	const hasAction = onClick !== undefined;

	const message = (
		<Box
			testId={`${testId}-errored-view-message`}
			tabIndex={hasAction ? 0 : undefined}
			xcss={cx(styles.message, hasPadding && styles.padding)}
		>
			<FormattedMessage {...descriptor} values={values} />
		</Box>
	);

	return hasAction ? (
		<Pressable
			onClick={data.onClick}
			style={{ color: `inherit`, font: `inherit`, textAlign: `inherit` }}
			xcss={styles.button}
		>
			{message}
		</Pressable>
	) : (
		message
	);
};

export default UnresolvedAction;
