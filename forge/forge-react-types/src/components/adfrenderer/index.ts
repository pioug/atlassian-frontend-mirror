import { type RendererProps } from '@atlaskit/renderer';

export type AdfRendererProps = RendererProps & {
	documentWithoutMedia?: RendererProps['document'];
};
