/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import type { ReactNode } from 'react';
import React, { useState } from 'react';

import Loadable from 'react-loadable';

import type {
	ExtensionManifest,
	ExtensionModule,
	ExtensionModuleActionObject,
	ExtensionModuleNode,
	ExtensionProvider,
	Parameters,
} from '@atlaskit/editor-common/extensions';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ButtonItem, HeadingItem, MenuGroup, Section } from '@atlaskit/menu';

import { useStateFromPromise } from '../../src/ui/ConfigPanel/use-state-from-promise';

export type CallbackParams = {
	extension?: ExtensionManifest;
	nodeKey?: string;
	item: ExtensionModule;
	node?: ExtensionModuleNode;
	parameters?: Parameters;
};

export default function ExtensionNodePicker({
	selectedExtension,
	selectedNode,
	extensionProvider,
	onSelect,
}: {
	selectedExtension?: string;
	selectedNode?: string;
	extensionProvider: ExtensionProvider;
	onSelect: (nodeParams: CallbackParams) => void;
}) {
	const [hasSelection, setHasSelection] = useState<boolean>(false);

	// AFP-2511 TODO: Fix automatic suppressions below
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const [extensions] = useStateFromPromise(extensionProvider.getExtensions, [extensionProvider]);

	return (
		<div
			style={{
				border: `1px solid #ccc`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				boxShadow: '0px 4px 8px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31)',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				borderRadius: 4,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				maxWidth: 320,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				maxHeight: '90vh',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				overflow: 'auto',
			}}
		>
			<MenuGroup>
				<Section>
					<HeadingItem>Select an extension</HeadingItem>
					{(extensions || []).map((extension, extensionIndex) => {
						return (
							extension.modules &&
							extension.modules.quickInsert &&
							extension.modules.quickInsert
								.map((item, nodeIndex) => {
									if (typeof item.action === 'object' && item.action.type === 'node') {
										const action = item.action as ExtensionModuleActionObject;

										const nodes = (extension.modules && extension.modules.nodes) || {};

										const node = nodes[action.key];

										let isSelected = false;

										if (!selectedExtension && extensionIndex === 0 && nodeIndex === 0) {
											isSelected = true;
										} else if (selectedExtension === extension.key && selectedNode === item.key) {
											isSelected = true;
										}

										const doSelect = () =>
											onSelect({
												extension: extension,
												nodeKey: action.key,
												node,
												parameters: action.parameters || {},
												item,
											});

										if (isSelected && isSelected !== hasSelection) {
											doSelect();
											setHasSelection(isSelected);
										}

										let iconProp: { elemBefore?: ReactNode } = {};

										if (item.icon) {
											const ExtensionIcon = Loadable<{ label: string }, never>({
												loader: item.icon,
												loading: () => null,
											});

											iconProp['elemBefore'] = <ExtensionIcon label={action.key} />;
										}

										return (
											<ButtonItem
												isSelected={isSelected}
												key={item.key}
												onClick={doSelect}
												description={item.description}
												// Ignored via go/ees005
												// eslint-disable-next-line react/jsx-props-no-spreading
												{...iconProp}
											>
												{item.title} ({extension.key})
											</ButtonItem>
										);
									}
								})
								.filter((a) => a)
						);
					})}
				</Section>
			</MenuGroup>
		</div>
	);
}
