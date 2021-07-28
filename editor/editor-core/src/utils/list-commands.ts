import {
  indentList,
  outdentList,
  toggleOrderedList,
  toggleBulletList,
} from '../plugins/list/commands';

// getListCommands provides commands for manipulating lists in the document.
export const getListCommands = () => {
  return {
    indentList,
    outdentList,
    toggleOrderedList,
    toggleBulletList,
  };
};
