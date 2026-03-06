import React from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { HyperlinkAddToolbar } from '@atlaskit/editor-common/link';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarItem,
	LinkPickerOptions,
} from '@atlaskit/editor-common/types';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { updateParameters } from '@atlaskit/native-embeds-common';

import type { EditorPluginNativeEmbedsPlugin } from '../../nativeEmbedsPluginType';
import { hideUrlToolbar } from '../actions';

interface EditUrlToolbarProps {
	api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined;
	linkPickerOptions?: LinkPickerOptions;
	lpLinkPicker: boolean;
	providerFactory: ProviderFactory;
	selectedNativeEmbed: ContentNodeWithPos;
	view: EditorView;
}

export const EditUrlToolbar = ({
	api,
	linkPickerOptions,
	lpLinkPicker,
	providerFactory,
	selectedNativeEmbed,
	view,
}: EditUrlToolbarProps): React.JSX.Element => {
	const currentUrl = selectedNativeEmbed.node.attrs.parameters?.url as string | undefined;
	const localId = selectedNativeEmbed.node.attrs.localId as string | undefined;

	const onSubmit = (href: string) => {
		view.dispatch(hideUrlToolbar(view.state.tr));

		if (href !== currentUrl && localId) {
			const extensionApi = api?.extension?.actions?.api();
			if (extensionApi?.doc?.update) {
				extensionApi.doc.update(localId, (current) => updateParameters(current, { url: href }));
			}
		}
	};

	const onEscapeOrClickAway: Command = (state, dispatch) => {
		if (dispatch) {
			dispatch(hideUrlToolbar(state.tr));
		}
		return true;
	};

	return (
		<HyperlinkAddToolbar
			view={view}
			providerFactory={providerFactory}
			linkPickerOptions={linkPickerOptions}
			displayUrl={currentUrl}
			lpLinkPicker={lpLinkPicker}
			invokeMethod={INPUT_METHOD.FLOATING_TB}
			onSubmit={(href) => onSubmit(href)}
			onEscapeCallback={onEscapeOrClickAway}
			onClickAwayCallback={onEscapeOrClickAway}
		/>
	);
};

export const buildNativeEmbedEditUrlToolbar = (
	props: Omit<EditUrlToolbarProps, 'view'>,
): FloatingToolbarItem<Command> => ({
	type: 'custom',
	disableArrowNavigation: true,
	fallback: [],
	render: (view) =>
		view ? (
			<EditUrlToolbar
				api={props.api}
				linkPickerOptions={props.linkPickerOptions}
				lpLinkPicker={props.lpLinkPicker}
				providerFactory={props.providerFactory}
				selectedNativeEmbed={props.selectedNativeEmbed}
				view={view}
			/>
		) : null,
});
