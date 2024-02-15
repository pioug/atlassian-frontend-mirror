import React from 'react';

import { useEditorThemeContext } from '../../hooks/use-editor-theme';

import { ExpandToggle } from './expand-toggle';
import { Search } from './search';
import { SyntaxHelp } from './syntax-help';

export const JQLEditorControlsContent = () => {
  const { isSearch } = useEditorThemeContext();
  return (
    <>
      <ExpandToggle />
      <SyntaxHelp />
      {isSearch && <Search />}
    </>
  );
};
