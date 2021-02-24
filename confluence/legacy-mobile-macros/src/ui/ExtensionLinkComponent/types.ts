import { DocNode } from '@atlaskit/adf-schema';
import { ExtensionParams } from '@atlaskit/editor-common';

export interface ExtensionLinkComponentProps {
  render: (document: DocNode) => JSX.Element;
  extension: ExtensionParams<any>;
}
