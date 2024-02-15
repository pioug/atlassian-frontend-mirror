import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { EditorProps } from '@atlaskit/editor-core';

export interface TestSuiteOptions {
  // set this to filter test run to help debug
  only?: boolean;
  nodeName: string;
  editorOptions?: EditorProps;
  adfs: {
    trailingSpaces: ADFEntity;
    notrailingSpaces: ADFEntity;
    multipleNodesAcrossLines: ADFEntity;
    multiline: ADFEntity;
  };
}
