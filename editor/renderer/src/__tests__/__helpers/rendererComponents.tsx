import React from 'react';
import type { ComponentType } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment } from 'relay-test-utils';

import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import pixelWidthMediaNested from '../__fixtures__/media-pixel-size-nested.adf.json';

import pixelWidthGreaterThenDefault from '../__fixtures__/media-pixel-greater-then-default.adf.json';

import inlineImageDefault from '../__fixtures__/media-inline-image-default.adf.json';
import inlineImageError from '../__fixtures__/media-inline-image-error.adf.json';
import inlineImageWithBorders from '../__fixtures__/media-inline-image-with-borders.adf.json';
import inlineImageWithLinks from '../__fixtures__/media-inline-image-with-links.adf.json';
import inlineImageWideLayout from '../__fixtures__/media-inline-image-wide-layout.adf.json';

import inlineImageWithLinksAndBorders from '../__fixtures__/media-inline-image-with-links-borders.adf.json';
import datasourceWithRichtext from '../__fixtures__/datasource-with-richtext.adf.json';
import listInBlockquote from '../__fixtures__/list-in-blockquote.adf.json';
import panelWithMedia from '../__fixtures__/panel-with-media.json';

import { overflowTable } from '../__fixtures__/overflow.adf';

import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { IntlProvider } from 'react-intl-next';
import Renderer from '../../ui/Renderer';
import type { RendererProps } from '../..';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';

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
	props: RendererProps,
	options?: {
		mockDatasources?: boolean;
		mockRelayEnvironment?: boolean;
		viewport?: { height?: number; width?: number };
	},
): ComponentType<React.PropsWithChildren<any>> => {
	const renderProps = {
		...defaultBaseRendererProps,
		...props,
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

export const TableRendererOverflow = generateRendererComponent({
	document: overflowTable,
	appearance: 'full-page',
	UNSTABLE_allowTableAlignment: true,
	UNSTABLE_allowTableResizing: true,
});

export const TableRendererWithInlineComments = () => (
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

export const PixelWidthGreaterThenDefault = generateRendererComponent({
	document: pixelWidthGreaterThenDefault,
	appearance: 'full-page',
});

export const PixelWidthGreaterThenDefaultFullWidth = generateRendererComponent({
	document: pixelWidthGreaterThenDefault,
	appearance: 'full-width',
});

export const MediaWithPixelWidthNested = generateRendererComponent({
	document: pixelWidthMediaNested,
	appearance: 'full-page',
});

export const MediaWithPixelWidthFullWidthNested = generateRendererComponent({
	document: pixelWidthMediaNested,
	appearance: 'full-width',
});

export const MediaImageInlineDefault = generateRendererComponent({
	document: inlineImageDefault,
	appearance: 'full-page',
});

export const MediaImageInlineError = generateRendererComponent({
	document: inlineImageError,
	appearance: 'full-page',
});

export const MediaImageInlineWithBorders = generateRendererComponent({
	document: inlineImageWithBorders,
	appearance: 'full-page',
});

export const MediaImageInlineWithLinks = generateRendererComponent({
	document: inlineImageWithLinks,
	appearance: 'full-page',
});

export const MediaImageInlineWithWideLayout = generateRendererComponent({
	document: inlineImageWideLayout,
	appearance: 'full-page',
});

export const MediaImageInlineWithLinksAndBorders = generateRendererComponent({
	document: inlineImageWithLinksAndBorders,
	appearance: 'full-page',
});

export const DatasourceWithRichTextFullPage = generateRendererComponent(
	{
		document: datasourceWithRichtext,
		appearance: 'full-page',
	},
	{
		mockDatasources: true,
	},
);

export const DatasourceWithRichTextFullWidth = generateRendererComponent(
	{
		document: datasourceWithRichtext,
		appearance: 'full-width',
	},
	{
		mockDatasources: true,
	},
);

export const ListInsideBlockquote = generateRendererComponent(
	{
		document: listInBlockquote,
		appearance: 'full-width',
	},
	{
		mockDatasources: true,
	},
);

export const MediaInsidePanelFullPage = generateRendererComponent(
	{
		document: panelWithMedia,
		appearance: 'full-page',
	},
	{
		mockDatasources: true,
	},
);
