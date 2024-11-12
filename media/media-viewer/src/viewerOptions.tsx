import { type NonErrorFileState } from '@atlaskit/media-client';

export interface ViewerOptionsProps {
	customRenderers?: CustomRendererConfig[];
}

export interface CustomRendererConfig {
	shouldUseCustomRenderer: (props: CustomRendererStateProps) => boolean;
	renderContent: (props: CustomRendererProps) => React.ReactNode;
}

export interface CustomRendererStateProps {
	fileItem: NonErrorFileState;
	archiveFileItem?: ArchiveFileItem; // references zip entry when archive is displayed
}

export interface CustomRendererProps extends CustomRendererStateProps {
	getBinaryContent: () => Promise<Blob>;
	onLoad: () => void;
	onError: (error: Error) => void;
}

export interface ArchiveFileItem {
	name: string;
}
