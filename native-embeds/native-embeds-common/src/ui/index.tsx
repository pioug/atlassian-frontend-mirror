import React, { useCallback } from 'react';

import { cssMap } from '@compiled/react';
import { defineMessages, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import type { CorePlugin } from '@atlaskit/editor-common/types';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { LocalIdPlugin } from '@atlaskit/editor-plugin-local-id';
import Heading from '@atlaskit/heading';
import RefreshIcon from '@atlaskit/icon/core/refresh';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const messages = defineMessages({
	title: {
		id: 'native-embeds-fallback-editor-extension.title',
		defaultMessage: 'Embed failed to load.',
		description:
			'Title shown in fallback extension when embedded content cannot be rendered in an editor.',
	},
	description: {
		id: 'native-embeds-fallback-editor-extension.description',
		defaultMessage: 'Something went wrong while loading the content.',
		description: 'Body text shown in fallback extension for failed embedded content in an editor.',
	},
	refresh: {
		id: 'native-embeds-fallback-editor-extension.refresh',
		defaultMessage: 'Refresh',
		description: 'Label for button that retries loading embedded content in an editor.',
	},
});

const styles = cssMap({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
		minHeight: '120px',
		backgroundColor: token('elevation.surface'),
	},
});

type NativeEmbedsEditorAPI = PublicPluginAPI<[CorePlugin, LocalIdPlugin]>;

export const NativeEmbedFallbackUI = ({
	api,
	localId,
	url,
}: {
	api?: NativeEmbedsEditorAPI;
	localId?: string;
	url?: string;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const onConvert = useCallback(() => {
		if (!localId) {
			return;
		}
		// If there is no URL, delete the node
		if (!url) {
			api?.core?.actions?.execute?.(({ tr }) => {
				const targetNode = api?.localId?.actions?.getNode({ localId });
				if (!targetNode) {
					return tr;
				}
				return tr.delete(targetNode.pos, targetNode.pos + targetNode.node.nodeSize);
			});
			return;
		}
		const schema = api?.core?.sharedState.currentState()?.schema;
		if (!schema) {
			return;
		}
		// Convert the native embed node to an inline card
		const inlineCard = schema.nodeFromJSON({
			type: 'paragraph',
			content: [{ type: 'inlineCard', attrs: { url } }],
		});
		api?.localId?.actions?.replaceNode({
			localId,
			value: inlineCard,
		});
	}, [api, localId, url]);

	return (
		<Box testId="native-embeds-fallback-extension" xcss={styles.container}>
			<Stack space="space.100" alignInline="center">
				<Heading size="small">{formatMessage(messages.title)}</Heading>
				<Text color="color.text.subtle">{formatMessage(messages.description)}</Text>
				<Button iconBefore={RefreshIcon} onClick={onConvert}>
					{formatMessage(messages.refresh)}
				</Button>
			</Stack>
		</Box>
	);
};
