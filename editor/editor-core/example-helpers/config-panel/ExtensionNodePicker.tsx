import React, { useState, ReactNode } from 'react';
import Loadable from 'react-loadable';

import { MenuGroup, Section, HeadingItem, ButtonItem } from '@atlaskit/menu';
import {
  ExtensionProvider,
  ExtensionManifest,
  ExtensionModuleNode,
  ExtensionModuleActionObject,
  Parameters,
  ExtensionModule,
} from '@atlaskit/editor-common/extensions';
import { useStateFromPromise } from '../../src/utils/react-hooks/use-state-from-promise';

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
  const [extensions] = useStateFromPromise(extensionProvider.getExtensions, [
    extensionProvider,
  ]);

  return (
    <div
      style={{
        border: `1px solid #ccc`,
        boxShadow:
          '0px 4px 8px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31)',
        borderRadius: 4,
        maxWidth: 320,
        maxHeight: '90vh',
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
                  if (
                    typeof item.action === 'object' &&
                    item.action.type === 'node'
                  ) {
                    const action = item.action as ExtensionModuleActionObject;

                    const nodes =
                      (extension.modules && extension.modules.nodes) || {};

                    const node = nodes[action.key];

                    let isSelected = false;

                    if (
                      !selectedExtension &&
                      extensionIndex === 0 &&
                      nodeIndex === 0
                    ) {
                      isSelected = true;
                    } else if (
                      selectedExtension === extension.key &&
                      selectedNode === item.key
                    ) {
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
                      const ExtensionIcon = Loadable<{ label: string }, any>({
                        loader: item.icon,
                        loading: () => null,
                      });

                      iconProp['elemBefore'] = (
                        <ExtensionIcon label={action.key} />
                      );
                    }

                    return (
                      <ButtonItem
                        isSelected={isSelected}
                        key={item.key}
                        onClick={doSelect}
                        description={item.description}
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
