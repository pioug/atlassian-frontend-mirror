import React, { useEffect, useState } from 'react';

import Loadable from 'react-loadable';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import ButtonGroup from '@atlaskit/button/button-group';
import type {
	ExtensionAPI,
	ExtensionManifest,
	ExtensionProvider,
	ExtensionToolbarButton,
} from '@atlaskit/editor-common/extensions';
import { getContextualToolbarItemsFromModule } from '@atlaskit/editor-common/extensions';
import { FloatingToolbarButton as Button } from '@atlaskit/editor-common/ui';
import { nodeToJSON } from '@atlaskit/editor-common/utils';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import Separator from './Separator';

interface Props {
	node: PMNode;
	extensionProvider: Promise<ExtensionProvider>;
	editorView: EditorView;
	separator?: 'start' | 'end' | 'both';
	applyChangeToContextPanel: ApplyChangeHandler | undefined;
	extensionApi: ExtensionAPI | undefined;
}

type ExtensionButtonProps = {
	item: ExtensionToolbarButton;
	editorView: EditorView;
	node: PMNode;
	applyChangeToContextPanel: ApplyChangeHandler | undefined;
	extensionApi: ExtensionAPI | undefined;
};

type ExtensionIconModule = ExtensionToolbarButton['icon'];

const noop = () => null;

const isDefaultExport = <T extends Object>(mod: T | { default: T }): mod is { default: T } => {
	return mod.hasOwnProperty('default');
};

const resolveExtensionIcon = async (getIcon: ExtensionIconModule) => {
	if (!getIcon) {
		return noop;
	}
	const maybeIcon = await getIcon();
	return isDefaultExport(maybeIcon) ? maybeIcon.default : maybeIcon;
};

const ExtensionButton = (props: ExtensionButtonProps) => {
	const { item, node, extensionApi } = props;

	const ButtonIcon = React.useMemo(
		() =>
			item.icon
				? Loadable<{ label: string }, never>({
						loader: async () => resolveExtensionIcon(item.icon),
						loading: noop,
					})
				: undefined,
		[item.icon],
	);

	const onClick = () => {
		if (typeof item.action !== 'function') {
			throw new Error(`'action' of context toolbar item '${item.key}' is not a function`);
		}

		const targetNodeAdf: ADFEntity = nodeToJSON(node);
		item.action(targetNodeAdf, extensionApi!);
	};

	const getAriaLabel = () => {
		if (item.ariaLabel) {
			return item.ariaLabel;
		}

		if (typeof item.tooltip === 'string') {
			return item.tooltip;
		}

		if (item.label) {
			return item.label;
		}

		return '';
	};

	return (
		<Button
			title={item.label}
			ariaLabel={getAriaLabel()}
			icon={ButtonIcon ? <ButtonIcon label={item.label || ''} /> : undefined}
			onClick={onClick}
			tooltipContent={item.tooltip}
			tooltipStyle={item.tooltipStyle}
			disabled={item.disabled}
		>
			{item.label}
		</Button>
	);
};

export const ExtensionsPlaceholder = (props: Props) => {
	const {
		node,
		editorView,
		extensionProvider,
		separator,
		applyChangeToContextPanel,
		extensionApi,
	} = props;
	const [extensions, setExtensions] = useState<ExtensionManifest<any>[]>([]);

	useEffect(() => {
		getExtensions();

		async function getExtensions() {
			const provider = await extensionProvider;
			if (provider) {
				setExtensions(await provider.getExtensions());
			}
		}
		// leaving dependencies array empty so that this effect runs just once on component mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const nodeAdf = React.useMemo(() => nodeToJSON(node), [node]);
	const extensionItems = React.useMemo(() => {
		return getContextualToolbarItemsFromModule(extensions, nodeAdf, extensionApi!);
	}, [extensions, nodeAdf, extensionApi]);

	if (!extensionItems.length) {
		return null;
	}

	// ButtonGroup wraps each child with another layer
	// but count fragment as 1 child, so here we create the children manually.
	const children: JSX.Element[] = [];
	if (separator && ['start', 'both'].includes(separator)) {
		children.push(<Separator />);
	}
	extensionItems.forEach((item: any, index: number) => {
		children.push(
			<ExtensionButton
				node={node}
				item={item}
				editorView={editorView}
				applyChangeToContextPanel={applyChangeToContextPanel}
				extensionApi={extensionApi}
			/>,
		);
		if (index < extensionItems.length - 1) {
			children.push(<Separator />);
		}
	});
	if (separator && ['end', 'both'].includes(separator)) {
		children.push(<Separator />);
	}

	// eslint-disable-next-line react/no-children-prop
	return <ButtonGroup children={children} />;
};
