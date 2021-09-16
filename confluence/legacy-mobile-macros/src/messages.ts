import { defineMessages } from 'react-intl';

import {
  ERROR_LOADING_TEXT,
  FINAL_ERROR_LOADING_TEXT,
  TAP_TO_LOAD_TEXT,
  TAP_TO_REFRESH_PAGE_TEXT,
  TAP_TO_RETRY_TEXT,
  TAP_TO_VIEW_TEXT,
} from './ui/MacroComponent/constants';

export const legacyMobileMacrosMessages = defineMessages({
  tapToLoadMacro: {
    id: 'fabric.editor.confluence.legacyMobileMacros.tapToLoadMacro',
    defaultMessage: TAP_TO_LOAD_TEXT,
    description: 'Tap block to load macro',
  },
  tapToViewMacro: {
    id: 'fabric.editor.confluence.legacyMobileMacros.tapToViewMacroMacro',
    defaultMessage: TAP_TO_VIEW_TEXT,
    description: 'Tap block to view macro',
  },
  tapToRetryLoadingMacro: {
    id: 'fabric.editor.confluence.legacyMobileMacros.tapToRetryLoadingMacro',
    defaultMessage: TAP_TO_RETRY_TEXT,
    description: 'Tap to retry loading macro after error',
  },
  errorLoadingMacro: {
    id: 'fabric.editor.confluence.legacyMobileMacros.errorLoadingMacro',
    defaultMessage: ERROR_LOADING_TEXT,
    description: 'Error loading macro',
  },
  finalErrorLoadingMacro: {
    id: 'fabric.editor.confluence.legacyMobileMacros.finalErrorLoadingMacro',
    defaultMessage: FINAL_ERROR_LOADING_TEXT,
    description: 'Could not load macro after final retry',
  },
  tapToRefreshPage: {
    id: 'fabric.editor.confluence.legacyMobileMacros.tapToRefreshPage',
    defaultMessage: TAP_TO_REFRESH_PAGE_TEXT,
    description: 'Tap block to refresh the macro view page',
  },
});
