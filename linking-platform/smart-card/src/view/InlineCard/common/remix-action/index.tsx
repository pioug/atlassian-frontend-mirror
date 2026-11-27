import React from 'react';

import { useIntl } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import RemixIcon from '@atlaskit/icon-lab/core/ai-generative-remix';
import type { LinkProviderRemixPlugin } from '@atlaskit/link-provider/types';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../messages';
import type { RemixActionData } from '../../../../state/flexible-ui-context/types';
import useInvokeClientAction from '../../../../state/hooks/use-invoke-client-action';
import { useRemixActionExposure } from '../../../../utils/use-remix-action-exposure';
import { ActionButton } from '../action-button';

const styles = cssMap({
	text: {
		paddingLeft: token('space.075'),
		display: 'inline-flex',
		alignItems: 'center',
		verticalAlign: 'middle',
		marginTop: token('space.negative.025'),
	},
});

const InlineRemixAction = ({
	data,
	remix,
	testId = 'inline-remix-action',
}: {
	data: RemixActionData;
	remix: LinkProviderRemixPlugin;
	testId?: string;
}): React.JSX.Element => {
	const intl = useIntl();
	const invoke = useInvokeClientAction({});
	const label = intl.formatMessage(messages.rovo_prompt_button_remix);

	useRemixActionExposure(true);

	return (
		<ActionButton
			aria-label={label}
			testId={testId}
			onClick={(event) => {
				event.preventDefault();
				event.stopPropagation();
				const anchorElement = event.currentTarget;
				void invoke({
					...data.invokeAction,
					actionFn: async () => remix.open({ anchorElement, url: data.url }),
				});
			}}
		>
			<RemixIcon label="" size="small" />
			<Box as="span" xcss={styles.text}>
				<Text size="small">{label}</Text>
			</Box>
		</ActionButton>
	);
};
export default InlineRemixAction;
