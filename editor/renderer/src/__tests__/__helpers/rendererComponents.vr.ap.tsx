import React from 'react';
import type { ComponentType } from 'react';

import { IntlProvider } from 'react-intl';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment } from 'relay-test-utils';

import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
import CardClient from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import type { RendererProps } from '../..';
import { Renderer } from '../../entry-points/renderer-default';
import datasourceWithRichtext from '../__fixtures__/datasource-with-richtext.adf.json';
import listInBlockquote from '../__fixtures__/list-in-blockquote.adf.json';
import inlineImageDefault from '../__fixtures__/media-inline-image-default.adf.json';
import inlineImageError from '../__fixtures__/media-inline-image-error.adf.json';
import inlineImageWideLayout from '../__fixtures__/media-inline-image-wide-layout.adf.json';
import inlineImageWithBorders from '../__fixtures__/media-inline-image-with-borders.adf.json';
import inlineImageWithLinksAndBorders from '../__fixtures__/media-inline-image-with-links-borders.adf.json';
import inlineImageWithLinks from '../__fixtures__/media-inline-image-with-links.adf.json';
import pixelWidthGreaterThenDefault from '../__fixtures__/media-pixel-greater-then-default.adf.json';
import pixelWidthMediaNested from '../__fixtures__/media-pixel-size-nested.adf.json';
import { overflowTable } from '../__fixtures__/overflow.adf';
import panelWithMedia from '../__fixtures__/panel-with-media.json';

const mockEnvironment = createMockEnvironment();

const contextIdentifierProvider = storyContextIdentifierProviderFactory();
const providerFactory = ProviderFactory.create({
	contextIdentifierProvider,
});

const defaultBaseRendererProps: Omit<RendererProps, 'document'> = {
	adfStage: 'stage0',
	dataProviders: providerFactory,
	schema: getSchemaBasedOnStage('stage0'),
	media: { allowLinking: true, allowCaptions: true },
};

export const generateRendererComponent = (
	props: Omit<RendererProps, 'document'> & {
		document: RendererProps['document'] | Record<string, unknown>;
	},
	options?: {
		mockDatasources?: boolean;
		mockRelayEnvironment?: boolean;
		viewport?: { height?: number; width?: number };
	},
): ComponentType<React.PropsWithChildren<any>> => {
	const renderProps = {
		...defaultBaseRendererProps,
		...props,
		document: props.document as RendererProps['document'],
	};

	const mockDatasources = options?.mockDatasources ?? false;
	const mockRelayEnvironment = options?.mockRelayEnvironment ?? false;

	return () => {
		const smartCardClient = React.useMemo(() => new CardClient('stg'), []);
		const datasourcesMocked = React.useRef(false);
		if (mockDatasources && !datasourcesMocked.current) {
			datasourcesMocked.current = true;
			mockDatasourceFetchRequests({
				initialVisibleColumnKeys: ['key', 'assignee', 'summary', 'description'],
				delayedResponse: false,
			});
		}

		const rendererContent = (
			<div
				style={{
					width: options?.viewport?.width ?? 'unset',
					height: options?.viewport?.height ?? 'unset',
				}}
			>
				<IntlProvider locale="en">
					<SmartCardProvider client={smartCardClient}>
						<MockMediaClientProvider>
							<Renderer {...renderProps} />
						</MockMediaClientProvider>
					</SmartCardProvider>
				</IntlProvider>
			</div>
		);

		if (mockRelayEnvironment) {
			return (
				<RelayEnvironmentProvider environment={mockEnvironment}>
					{rendererContent}
				</RelayEnvironmentProvider>
			);
		}

		return rendererContent;
	};
};

export const TableRendererOverflow: React.ComponentType<any> = generateRendererComponent({
	document: overflowTable,
	appearance: 'full-page',
	UNSTABLE_allowTableAlignment: true,
	UNSTABLE_allowTableResizing: true,
});

export const TableRendererWithInlineComments = (): React.JSX.Element => (
	<>
		<TableRendererOverflow />
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				position: 'absolute',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				right: '200px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				top: '70px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '300px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				height: '50px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				background: 'white',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				border: '1px solid red',
			}}
		>
			Inline comments
		</div>
	</>
);

export const PixelWidthGreaterThenDefault: React.ComponentType<any> = generateRendererComponent({
	document: pixelWidthGreaterThenDefault,
	appearance: 'full-page',
});

export const PixelWidthGreaterThenDefaultFullWidth: React.ComponentType<any> =
	generateRendererComponent({
		document: pixelWidthGreaterThenDefault,
		appearance: 'full-width',
	});

export const MediaWithPixelWidthNested: React.ComponentType<any> = generateRendererComponent({
	document: pixelWidthMediaNested,
	appearance: 'full-page',
});

export const MediaWithPixelWidthFullWidthNested: React.ComponentType<any> =
	generateRendererComponent({
		document: pixelWidthMediaNested,
		appearance: 'full-width',
	});

export const MediaImageInlineDefault: React.ComponentType<any> = generateRendererComponent({
	document: inlineImageDefault,
	appearance: 'full-page',
});

export const MediaImageInlineError: React.ComponentType<any> = generateRendererComponent({
	document: inlineImageError,
	appearance: 'full-page',
});

export const MediaImageInlineWithBorders: React.ComponentType<any> = generateRendererComponent({
	document: inlineImageWithBorders,
	appearance: 'full-page',
});

export const MediaImageInlineWithLinks: React.ComponentType<any> = generateRendererComponent({
	document: inlineImageWithLinks,
	appearance: 'full-page',
});

export const MediaImageInlineWithWideLayout: React.ComponentType<any> = generateRendererComponent({
	document: inlineImageWideLayout,
	appearance: 'full-page',
});

export const MediaImageInlineWithLinksAndBorders: React.ComponentType<any> =
	generateRendererComponent({
		document: inlineImageWithLinksAndBorders,
		appearance: 'full-page',
	});

export const DatasourceWithRichTextFullPage: React.ComponentType<any> = generateRendererComponent(
	{
		document: datasourceWithRichtext,
		appearance: 'full-page',
	},
	{
		mockDatasources: true,
	},
);

export const DatasourceWithRichTextFullWidth: React.ComponentType<any> = generateRendererComponent(
	{
		document: datasourceWithRichtext,
		appearance: 'full-width',
	},
	{
		mockDatasources: true,
	},
);

export const ListInsideBlockquote: React.ComponentType<any> = generateRendererComponent(
	{
		document: listInBlockquote,
		appearance: 'full-width',
	},
	{
		mockDatasources: true,
	},
);

export const MediaInsidePanelFullPage: React.ComponentType<any> = generateRendererComponent(
	{
		document: panelWithMedia,
		appearance: 'full-page',
	},
	{
		mockDatasources: true,
	},
);
