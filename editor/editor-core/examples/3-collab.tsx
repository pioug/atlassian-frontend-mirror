/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';

import { useConfluenceFullPagePreset } from '@af/editor-examples-helpers/example-presets';
import Button from '@atlaskit/button/new';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { mentionResourceProviderWithResolver } from '@atlaskit/util-data-test/mention-story-data';

import { createProvider } from '../example-helpers/mockWebSocketsCollabProvider';

const BaseEditor = ({ name }: { name: string }) => {
	const provider = useMemo(() => {
		return Promise.resolve(createProvider());
	}, []);

	const { preset, editorApi } = useConfluenceFullPagePreset({
		editorAppearance: 'full-page',
		overridedFullPagePresetProps: {
			pluginOptions: {
				editorViewMode: {
					viewMode: 'edit',
				},
				collabEdit: {
					collabEdit: {
						provider: provider,
						useNativePlugin: true,
					},
					__livePage: true,
				},
			},
			providers: {
				collabEditProvider: provider,
			},
			enabledOptionalPlugins: {
				connectivity: true,
			},
		},
	});
	const [isConnected, setConnected] = useState(true);

	return (
		<div>
			<Button
				testId={`disconnect_button_${name}`}
				onClick={() => {
					provider.then((res) => {
						if (isConnected) {
							// @ts-expect-error Private property
							res.channel.disconnect();
							editorApi?.core.actions.execute(editorApi?.connectivity?.commands.setMode('offline'));
							setConnected(false);
						} else {
							// @ts-expect-error Private property
							res.channel.connect();
							editorApi?.core.actions.execute(editorApi?.connectivity?.commands.setMode('online'));
							const connectedCallback = () => {
								setConnected(true);
								// @ts-expect-error Private property
								res.channel.off('connected', connectedCallback);
							};
							// @ts-expect-error Private property
							res.channel.on('connected', connectedCallback);
						}
					});
				}}
			>
				{isConnected ? 'Disconnect' : 'Connect'}
			</Button>
			<ComposableEditor
				appearance="full-page"
				preset={preset}
				mentionProvider={Promise.resolve(mentionResourceProviderWithResolver)}
				collabEdit={{ provider: provider }}
			/>
		</div>
	);
};

const columns = css({
	display: 'flex',
	flexDirection: 'row',
});

const column = css({
	flex: '1 1 0',
});

export default function CollabMultipleProvider() {
	return (
		<IntlProvider locale="en">
			<div>
				<div css={columns} data-testid="collab-editor-left">
					<div css={column}>
						<BaseEditor name="left" />
					</div>
					<div css={column} data-testid="collab-editor-middle">
						<BaseEditor name="middle" />
					</div>
					<div css={column} data-testid="collab-editor-right">
						<BaseEditor name="right" />
					</div>
				</div>
			</div>
		</IntlProvider>
	);
}
