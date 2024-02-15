import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import noop from 'lodash/noop';

export type EditorTheme = {
  /**
   * The maximum number of rows that are visible in the default editor view.
   */
  defaultMaxRows: number;
  /**
   * `true` if the editor view is in the expanded state.
   */
  expanded: boolean;
  /**
   * The number of rows that are visible when the editor view is expanded.
   */
  expandedRows: number;
  /**
   * Toggle the editor view expanded state.
   */
  toggleExpanded: () => void;
  /**
   * `true` shows search button, other search related elements
   * `false` to act as a text field
   */
  isSearch: boolean;
  /**
   * `false` matches AK's default field styling
   * `true` matches AK's compact field styling, generally used for search purposes.
   */
  isCompact: boolean;
};

const defaultMaxRows = 3;
const expandedRows = 15;

const defaultEditorTheme: EditorTheme = {
  defaultMaxRows,
  expanded: false,
  expandedRows,
  toggleExpanded: noop,
  isSearch: false,
  isCompact: false,
};

export const EditorThemeContext =
  createContext<EditorTheme>(defaultEditorTheme);

/**
 * Hook to manage the theming state of the editor.
 */
export const useEditorTheme = ({
  isSearch = false,
  isCompact = false,
}: {
  isSearch?: boolean;
  isCompact?: boolean;
}): EditorTheme => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(
    () => setExpanded(prevState => !prevState),
    [],
  );

  return useMemo(
    () => ({
      defaultMaxRows,
      expanded,
      expandedRows,
      toggleExpanded,
      isSearch,
      isCompact,
    }),
    [expanded, toggleExpanded, isSearch, isCompact],
  );
};

export const useEditorThemeContext = () => useContext(EditorThemeContext);
