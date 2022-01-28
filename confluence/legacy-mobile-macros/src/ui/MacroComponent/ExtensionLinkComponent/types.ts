import { DocNode } from '@atlaskit/adf-schema';
import type { ExtensionParams } from '@atlaskit/editor-common/extensions';

export interface ExtensionLinkComponentProps {
  render: (document: DocNode) => JSX.Element;
  extension: ExtensionParams<any>;
}
