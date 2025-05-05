import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { Box, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { InternalActionName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';

const styles = cssMap({
	button: {
		display: 'contents',
	},
	message: {
		paddingBlock: token('space.0'),
		paddingInline: token('space.0'),
	},
});

const UnresolvedAction = ({ testId = 'unresolved-action' }: { testId?: string }) => {
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
			xcss={styles.message}
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
