import React from 'react';

import noop from 'lodash/noop';

import { useEditorThemeContext } from '../../../hooks/use-editor-theme';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { BaseExpandToggle } from '../base-expand-toggle';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { BaseSearch } from '../base-search';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { BaseSyntaxHelp } from '../base-syntax-help';

export const ReadOnlyControlsContent = () => {
  const { isSearch } = useEditorThemeContext();
  return (
    <>
      <BaseExpandToggle
        label={''}
        editorId={''}
        expanded={false}
        onClick={noop}
        isDisabled={true}
      />
      <BaseSyntaxHelp label={''} onClick={noop} isDisabled={true} />
      {isSearch && <BaseSearch label={''} onSearch={noop} isDisabled={true} />}
    </>
  );
};
