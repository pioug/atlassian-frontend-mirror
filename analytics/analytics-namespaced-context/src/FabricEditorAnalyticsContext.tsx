import { StatelessComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';

export const EDITOR_CONTEXT = 'fabricEditorCtx';

export enum EDITOR_APPEARANCE_CONTEXT {
  FIXED_WIDTH = 'fixedWidth',
  FULL_WIDTH = 'fullWidth',
  COMMENT = 'comment',
  CHROMELESS = 'chromeless',
  MOBILE = 'mobile',
}

type FabricEditorAnalyticsContextProps = Props & {
  data: {
    appearance: EDITOR_APPEARANCE_CONTEXT | undefined;
    packageName: string;
    packageVersion: string;
    componentName: 'editorCore';
  };
};

export const FabricEditorAnalyticsContext: StatelessComponent<FabricEditorAnalyticsContextProps> = createNamespaceContext<
  FabricEditorAnalyticsContextProps
>(EDITOR_CONTEXT, 'FabricEditorAnalyticsContext');
