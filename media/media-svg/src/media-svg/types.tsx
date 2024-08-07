import { type CSSProperties } from 'react';

import type { FileIdentifier } from '@atlaskit/media-client';

import { type MediaSVGError } from './errors';

type Dimensions = {
	width?: number | string;
	height?: number | string;
};

export interface MediaSvgProps {
	/* Test Id */
	testId?: string;
	/* SVG file identifier (uploaded to Media Store) */
	identifier: FileIdentifier;
	/* Dimensions of the rendered image. Can be pixel or any CSS unit. By default, the image will render to its internal dimension properties. */
	dimensions?: Dimensions;
	/* Callback that will be called if an error occurs. */
	onError?: (error: MediaSVGError) => void;
	/* alt text for the image element */
	alt?: string;
	/* IMG onLoad callback */
	onLoad?: (evt: React.SyntheticEvent<HTMLImageElement>) => void;
	/* IMG onMouseDown callback */
	onMouseDown?: (ev: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
	/* Override default styles */
	style?: CSSProperties;
	/* Reference to the rendered SVG image element */
	innerRef?: React.Ref<HTMLImageElement>;
}

export type ContentSource = 'remote' | 'local';
