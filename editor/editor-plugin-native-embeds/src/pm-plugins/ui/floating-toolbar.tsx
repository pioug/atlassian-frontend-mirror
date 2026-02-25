import React from 'react';

import type {
	Command,
	DropdownOptionT,
	ExtractInjectionAPI,
	FloatingToolbarHandler,
} from '@atlaskit/editor-common/types';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import AlignTextCenterIcon from '@atlaskit/icon/core/align-text-center';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AlignTextRightIcon from '@atlaskit/icon/core/align-text-right';
import BorderIcon from '@atlaskit/icon/core/border';
import ContentWrapLeftIcon from '@atlaskit/icon/core/content-wrap-left';
import ContentWrapRightIcon from '@atlaskit/icon/core/content-wrap-right';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import PageIcon from '@atlaskit/icon/core/page';
import RefreshIcon from '@atlaskit/icon/core/refresh';

import type {
	EditorPluginNativeEmbedsPlugin,
	EditorPluginNativeEmbedsToolbarHandlers,
} from '../../nativeEmbedsPluginType';
import {
	ALIGNMENT_VALUES,
	createAlignmentUpdate,
	DEFAULT_ALIGNMENT,
	type AlignmentValue,
} from '../../types/alignment';
import { getSelectedNativeEmbedExtension } from '../utils/getSelectedNativeEmbedExtension';

import { getMoreOptionsDropdown } from './more-options-dropdown';

// TODO: CNS-23819 - Add i18n and finalise whether these should show as just icons with tooltips or text labels.
const ALIGNMENT_LABELS: Record<AlignmentValue, string> = {
	left: 'Align left',
	center: 'Align center',
	right: 'Align right',
	'wrap-left': 'Wrap left',
	'wrap-right': 'Wrap right',
};

const ALIGNMENT_ICONS: Record<AlignmentValue, typeof AlignTextLeftIcon> = {
	left: AlignTextLeftIcon,
	center: AlignTextCenterIcon,
	right: AlignTextRightIcon,
	'wrap-left': ContentWrapLeftIcon,
	'wrap-right': ContentWrapRightIcon,
};

const getAlignmentIcon = (alignment: AlignmentValue): React.ReactElement => {
	const IconComponent = ALIGNMENT_ICONS[alignment];
	return (
		<IconComponent color="currentColor" spacing="spacious" label={ALIGNMENT_LABELS[alignment]} />
	);
};

const createHandlerCommand =
	(handler?: () => void): Command =>
	() => {
		handler?.();
		return true;
	};

const createUpdateAlignmentCommand =
	(
		api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined,
		alignment: AlignmentValue,
	): Command =>
	(state, _dispatch, _view) => {
		const selectedNativeEmbed = getSelectedNativeEmbedExtension(state);
		const localId = selectedNativeEmbed?.node.attrs.localId;
		if (!localId) {
			return false;
		}

		const extensionApi = api?.extension?.actions?.api();
		if (!extensionApi?.doc?.update) {
			return false;
		}

		extensionApi.doc.update(localId, (current) => createAlignmentUpdate(current, alignment));

		return true;
	};

interface GetToolbarConfigProps {
	api?: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin>;
	handlers?: EditorPluginNativeEmbedsToolbarHandlers;
}

export const getToolbarConfig =
	({ api, handlers }: GetToolbarConfigProps): FloatingToolbarHandler =>
	(state, _intl, _providerFactory, _activeConfigs) => {
		const selectedNativeEmbed = getSelectedNativeEmbedExtension(state);
		if (!selectedNativeEmbed) {
			return undefined;
		}

		const currentAlignment =
			(selectedNativeEmbed.node.attrs.parameters?.alignment as AlignmentValue | undefined) ??
			DEFAULT_ALIGNMENT;

		const alignmentOptions: DropdownOptionT<Command>[] = ALIGNMENT_VALUES.map((alignment) => ({
			id: `native-embed-alignment-${alignment}`,
			title: ALIGNMENT_LABELS[alignment],
			onClick: createUpdateAlignmentCommand(api, alignment),
			selected: currentAlignment === alignment,
			icon: getAlignmentIcon(alignment),
		}));

		const alignmentDropdownTitle = ALIGNMENT_LABELS[currentAlignment];
		const AlignmentIconComponent = ALIGNMENT_ICONS[currentAlignment];

		const getDomRef = (view: EditorView) => {
			try {
				const node = findDomRefAtPos(selectedNativeEmbed.pos, view.domAtPos.bind(view));
				return node instanceof HTMLElement ? node : undefined;
			} catch {
				return undefined;
			}
		};

		return {
			title: 'Native Embed floating toolbar',
			getDomRef,
			nodeType: state.schema.nodes.extension,
			items: [
				{
					id: 'native-embed-refresh-button',
					type: 'button',
					title: 'Refresh',
					showTitle: true,
					icon: RefreshIcon,
					onClick: createHandlerCommand(handlers?.onRefreshClick),
					focusEditoronEnter: true,
					tabIndex: null,
				},
				{
					type: 'separator',
					fullHeight: true,
				},
				{
					id: 'native-embed-embed-dropdown',
					type: 'dropdown',
					title: 'Embed',
					iconBefore: PageIcon,
					options: [],
					onClick: handlers?.onEmbedClick,
				},
				{
					id: 'native-embed-change-border-dropdown',
					type: 'dropdown',
					title: '',
					iconBefore: BorderIcon,
					options: [],
					onClick: handlers?.onChangeBorderClick,
				},
				{
					id: 'native-embed-alignment-dropdown',
					type: 'dropdown',
					title: '',
					iconBefore: () => (
						<AlignmentIconComponent
							color="currentColor"
							spacing="spacious"
							label={alignmentDropdownTitle}
						/>
					),
					options: alignmentOptions,
					showSelected: true,
				},
				{
					type: 'separator',
					fullHeight: true,
				},
				{
					id: 'native-embed-open-new-window-button',
					type: 'button',
					title: 'Open in new window',
					icon: LinkExternalIcon,
					iconFallback: LinkExternalIcon,
					onClick: createHandlerCommand(handlers?.onOpenInNewWindowClick),
					focusEditoronEnter: true,
					tabIndex: null,
				},
				{
					type: 'separator',
					fullHeight: true,
				},
				getMoreOptionsDropdown(),
			],
		};
	};
