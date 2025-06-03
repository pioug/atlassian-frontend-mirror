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
import { isSelectionTableNestedInTable } from '@atlaskit/editor-common/nesting';
import {
	FloatingToolbarButton as Button,
	FloatingToolbarSeparator as Separator,
} from '@atlaskit/editor-common/ui';
import { nodeToJSON } from '@atlaskit/editor-common/utils';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import Dropdown from './Dropdown';

interface Props {
	node: PMNode;
	extensionProvider: Promise<ExtensionProvider>;
	editorView: EditorView;
	separator?: 'start' | 'end' | 'both';
	applyChangeToContextPanel: ApplyChangeHandler | undefined;
	extensionApi: ExtensionAPI | undefined;
	scrollable?: boolean;
	setDisableScroll?: (disable: boolean) => void;
	dispatchCommand?: (command: Function) => void;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	setDisableParentScroll?: (disable: boolean) => void;
	alignDropdownWithToolbar?: boolean;
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
						// Ignored via go/ees005
						// eslint-disable-next-line require-await
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
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
		scrollable,
		setDisableScroll,
		dispatchCommand,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		alignDropdownWithToolbar,
	} = props;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

	const isNestedTable =
		fg('platform_editor_use_nested_table_pm_nodes') &&
		isSelectionTableNestedInTable(editorView.state);

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	extensionItems.forEach((item: any, index: number) => {
		// disable the referentiality and charts extensions for nested tables
		if (isNestedTable && ['referentiality:connections', 'chart:insert-chart'].includes(item.key)) {
			item.disabled = true;
		}

		if ('type' in item && item.type === 'dropdown') {
			children.push(
				<Dropdown
					key={item.id}
					title={item.title}
					icon={item.icon}
					dispatchCommand={dispatchCommand || (() => {})}
					options={item.options}
					disabled={item.disabled}
					tooltip={item.tooltip}
					hideExpandIcon={item.hideExpandIcon}
					mountPoint={popupsMountPoint}
					boundariesElement={popupsBoundariesElement}
					scrollableElement={popupsScrollableElement}
					dropdownWidth={item.dropdownWidth}
					showSelected={item.showSelected}
					buttonTestId={item.testId}
					editorView={editorView}
					setDisableParentScroll={scrollable ? setDisableScroll : undefined}
					dropdownListId={item?.id && `${item.id}-dropdownList`}
					alignDropdownWithToolbar={alignDropdownWithToolbar}
					onToggle={item.onToggle}
					footer={item.footer}
					onMount={item.onMount}
					onClick={item.onClick}
					pulse={item.pulse}
				/>,
			);
		} else {
			children.push(
				<ExtensionButton
					node={node}
					item={item as ExtensionToolbarButton}
					editorView={editorView}
					applyChangeToContextPanel={applyChangeToContextPanel}
					extensionApi={extensionApi}
				/>,
			);
		}

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
