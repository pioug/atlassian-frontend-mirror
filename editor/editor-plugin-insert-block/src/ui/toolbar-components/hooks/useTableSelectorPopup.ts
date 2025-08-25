import { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { InsertBlockPlugin } from '../../../insertBlockPluginType';

import { usePopupManager } from './usePopupManager';

interface UseTableSelectorPopupProps {
  api?: ExtractInjectionAPI<InsertBlockPlugin>;
  buttonRef: React.RefObject<HTMLElement>;
}

export const useTableSelectorPopup = ({ api, buttonRef }: UseTableSelectorPopupProps) => {
  const popupManager = usePopupManager({
    focusTarget: buttonRef,
  });

  const handleSelectedTableSize = useCallback((rowsCount: number, colsCount: number) => {
    // workaround to solve race condition where cursor is not placed correctly inside table
    queueMicrotask(() => {
      api?.core?.actions.execute(
        api?.table?.commands.insertTableWithSize(rowsCount, colsCount, INPUT_METHOD.PICKER)
      );
    });
    popupManager.close();
  }, [api, popupManager]);

  const onPopupUnmount = useCallback(() => {
    api?.core.actions.focus();
  }, [api]);

  return {
    ...popupManager,
    handleSelectedTableSize,
    onPopupUnmount,
  };
};
