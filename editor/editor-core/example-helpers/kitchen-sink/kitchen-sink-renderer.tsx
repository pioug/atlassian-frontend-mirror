import React from 'react';
import {
  Provider as SmartCardProvider,
  Client as SmartCardClient,
} from '@atlaskit/smart-card';
import { ReactRenderer } from '@atlaskit/renderer';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { RendererPadding } from './kitchen-sink-styles';
import { EditorAppearance } from '../../src/types';
import { exampleMediaFeatureFlags } from '@atlaskit/media-test-helpers/exampleMediaFeatureFlags';

export interface KitchenSinkRendererProps {
  appearance: EditorAppearance;
  dataProviders: any;
  document: any;
  isFullPage: boolean;
  locale: string;
  featureFlags: Record<string, boolean>;
}

export const KitchenSinkRenderer: React.StatelessComponent<KitchenSinkRendererProps> = React.memo(
  (props) => {
    const smartCardClient = React.useMemo(() => new SmartCardClient('stg'), []);

    return (
      <RendererPadding hasPadding={props.isFullPage}>
        <SmartCardProvider client={smartCardClient}>
          <ReactRenderer
            allowHeadingAnchorLinks={{
              allowNestedHeaderLinks: true,
            }}
            document={props.document}
            adfStage="stage0"
            dataProviders={props.dataProviders}
            allowColumnSorting={true}
            shouldOpenMediaViewer={true}
            appearance={props.appearance as any}
            allowAltTextOnImages={true}
            extensionHandlers={extensionHandlers}
            media={{
              featureFlags: { ...exampleMediaFeatureFlags, captions: true },
              allowLinking: true,
              enableDownloadButton: true,
            }}
            allowCopyToClipboard={true}
            useSpecBasedValidator={true}
            allowSelectAllTrap
            featureFlags={props.featureFlags}
          />
        </SmartCardProvider>
      </RendererPadding>
    );
  },
);
