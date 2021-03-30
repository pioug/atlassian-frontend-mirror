import {
  indentList as predictableIndentList,
  outdentList as predictableOutdentList,
  toggleOrderedList as predictableToggleOrderedList,
  toggleBulletList as predictableToggleBulletList,
} from '../plugins/lists-predictable/commands';
import {
  indentList as legacyIndentList,
  outdentList as legacyOutdentList,
  toggleOrderedList as legacyToggleOrderedList,
  toggleBulletList as legacyToggleBulletList,
} from '../plugins/lists/commands';

// getListCommands provides commands for manipulating lists in the document.
// `isPredictable` will opt in to the new predictable list behaviors
export const getListCommands = (isPredictable = false) => {
  if (isPredictable) {
    return {
      indentList: predictableIndentList,
      outdentList: predictableOutdentList,
      toggleOrderedList: predictableToggleOrderedList,
      toggleBulletList: predictableToggleBulletList,
    };
  }

  return {
    indentList: legacyIndentList,
    outdentList: legacyOutdentList,
    toggleOrderedList: legacyToggleOrderedList,
    toggleBulletList: legacyToggleBulletList,
  };
};
