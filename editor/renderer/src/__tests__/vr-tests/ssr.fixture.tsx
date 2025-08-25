import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import {
	ssrCodeBlockDoc,
	ssrCodeBlockInBlockquoteDoc,
	ssrExpandDoc,
	ssrNestedExpandInExpandDoc,
	ssrLayoutDoc,
	ssrTableDoc,
	ssrMediaInBlockquoteDoc,
} from '../__fixtures__/renderer-ssr.adf';
import { resizedImagedoc } from '../__fixtures__/ssr-resized-image.adf';
import { resizedMedia, mediaInTable } from '../__fixtures__/ssr-resized-media.adf';
import { smartCardAdf, smartCardAtlassianProjectAdf } from '../__fixtures__/ssr-smart-card.adf';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';
import { IntlProvider } from 'react-intl-next';
import Loadable from 'react-loadable';
import { ReactRenderer, type RendererProps } from '../../index';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { DocNode } from '@atlaskit/adf-schema';
import {
	url,
	cardState,
	atlassianProjectCardState,
	atlassianProjectUrl,
} from '@atlaskit/media-test-helpers/smart-card-state';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RendererWrapper = ({
	adf,
	rendererProps,
}: {
	adf: DocNode;
	rendererProps?: Partial<RendererProps>;
}) => {
	return (
		<IntlProvider locale="en">
			<SmartCardProvider storeOptions={storeOptions} client={new CardClient('staging')}>
				<ReactRenderer
					document={adf}
					schema={defaultSchema}
					appearance="full-page"
					enableSsrInlineScripts={true}
					smartLinks={{ ssr: true }}
					{...rendererProps}
				/>
			</SmartCardProvider>
		</IntlProvider>
	);
};

interface CustomProvidersProps {
	[k: string]: any;
	children?: JSX.Element;
}

const RendererSSR = ({
	adf,
	rendererProps,
}: {
	adf: DocNode;
	rendererProps?: Partial<RendererProps>;
}) => {
	const [htmlString, setHtmlString] = useState<string | null>(null);
	useEffect(() => {
		Loadable.preloadAll().then(() => {
			const element = React.createElement<CustomProvidersProps>(() => (
				<RendererWrapper adf={adf} rendererProps={rendererProps} />
			));
			const html = ReactDOMServer.renderToString(element);
			setHtmlString(html);
		});
	}, [adf, rendererProps]);

	if (!htmlString) {
		return null;
	}

	return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

export const RendererSSRTable = () => {
	return <RendererSSR adf={ssrTableDoc} rendererProps={{ UNSTABLE_allowTableResizing: true }} />;
};

export const RendererSSRLayout = () => {
	return <RendererSSR adf={ssrLayoutDoc} />;
};

export const RendererSSRExpand = () => {
	return <RendererSSR adf={ssrExpandDoc} />;
};

export const RendererSSRNestedExpandInExpand = () => {
	return <RendererSSR adf={ssrNestedExpandInExpandDoc} />;
};

export const RendererSSRCodeblock = () => {
	return <RendererSSR adf={ssrCodeBlockDoc} />;
};

export const RendererSSRCodeblockInBlockquote = () => {
	return <RendererSSR adf={ssrCodeBlockInBlockquoteDoc} />;
};

export const RendererSSRMediaInBlockquote = () => {
	return <RendererSSR adf={ssrMediaInBlockquoteDoc} />;
};

export const RendererSSRResizedImage = () => {
	return <RendererSSR adf={resizedImagedoc} />;
};

export const RendererSSRResizedMedia = () => {
	return <RendererSSR adf={resizedMedia} />;
};

export const RendererSSRResizedMediaInTable = () => {
	return <RendererSSR adf={mediaInTable} />;
};

const storeOptions = {
	initialState: {
		[url]: cardState,
		[atlassianProjectUrl]: atlassianProjectCardState,
	},
};

export const RendererSSRSmartCard = () => {
	return <RendererSSR adf={smartCardAdf} />;
};

export const RendererSSRSmartCardUrlIcon = () => {
	return <RendererSSR adf={smartCardAtlassianProjectAdf} />;
};
