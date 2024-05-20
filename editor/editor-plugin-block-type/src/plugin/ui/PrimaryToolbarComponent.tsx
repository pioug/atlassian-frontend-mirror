import React from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { TextBlockTypes } from '../block-types';
import type { BlockTypePlugin } from '../index';

import ToolbarBlockType from './ToolbarBlockType';

interface PrimaryToolbarComponentProps {
  isSmall: boolean;
  isToolbarReducedSpacing: boolean;
  disabled: boolean;
  api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  shouldUseDefaultRole: boolean;
}

export function PrimaryToolbarComponent({
  api,
  isSmall,
  disabled,
  isToolbarReducedSpacing,
  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,
  shouldUseDefaultRole,
}: PrimaryToolbarComponentProps) {
  const { blockTypeState } = useSharedPluginState(api, ['blockType']);
  const boundSetBlockType = (name: TextBlockTypes) =>
    api?.core?.actions.execute(
      api?.blockType?.commands?.setTextLevel(name, INPUT_METHOD.TOOLBAR),
    );
  return (
    <ToolbarBlockType
      isSmall={isSmall}
      isDisabled={disabled}
      isReducedSpacing={isToolbarReducedSpacing}
      setTextLevel={boundSetBlockType}
      pluginState={blockTypeState!}
      popupsMountPoint={popupsMountPoint}
      popupsBoundariesElement={popupsBoundariesElement}
      popupsScrollableElement={popupsScrollableElement}
      shouldUseDefaultRole={shouldUseDefaultRole}
    />
  );
}
