/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { type AnnotationProviders as RendererAnnotationProviders } from '@atlaskit/editor-common/types';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { exampleMediaFeatureFlags } from '@atlaskit/media-test-helpers/exampleMediaFeatureFlags';
import { ReactRenderer } from '@atlaskit/renderer';
import { Y200, Y75 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { EditorAppearance } from '../../src/types';

import { rendererPadding } from './kitchen-sink-styles';

export interface KitchenSinkRendererProps {
	appearance: EditorAppearance;
	dataProviders: any;
	document: any;
	isFullPage: boolean;
	locale: string;
	featureFlags: Record<string, boolean>;
	rendererAnnotationProviders: RendererAnnotationProviders;
}

const wrapperStyles = css({
	"[data-mark-type='annotation']": {
		backgroundColor: token('color.background.accent.yellow.subtler', Y75),
		borderBottom: `2px solid ${token('color.border.accent.yellow', Y200)}`,
	},
});

export const KitchenSinkRenderer = React.memo((props: KitchenSinkRendererProps) => {
	const smartCardClient = React.useMemo(() => new CardClient('stg'), []);

	return (
		<div css={[rendererPadding(props.isFullPage), wrapperStyles]}>
			<SmartCardProvider client={smartCardClient}>
				<ReactRenderer
					annotationProvider={props.rendererAnnotationProviders}
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
						featureFlags: { ...exampleMediaFeatureFlags },
						allowLinking: true,
						allowCaptions: true,
						enableDownloadButton: true,
					}}
					allowCopyToClipboard={true}
					allowWrapCodeBlock={true}
					useSpecBasedValidator={true}
					allowSelectAllTrap
					featureFlags={props.featureFlags}
					allowCustomPanels={true}
				/>
			</SmartCardProvider>
		</div>
	);
});
