/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FileCardProps
 *
 * @codegen <<SignedSource::9d37f634e1e60eac0f6536fd9bff9abc>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/filecard/index.tsx <<SignedSource::9312e79a0aa240027297b3e080a2960a>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export type FileCardProps = {
	/**
	 * Whether the file can be deleted
	 */
	canDelete?: boolean;

	/**
	 * Whether the file can be downloaded
	 */
	canDownload?: boolean;

	/**
	 * Error message to display if there's an error
	 */
	error?: string;

	/**
	 * The name of the file to display
	 */
	fileName: string;

	/**
	 * The size of the file in bytes
	 */
	fileSize?: number;

	/**
	 * The MIME type of the file
	 */
	fileType?: string;

	/**
	 * Whether the file is currently being uploaded
	 */
	isUploading?: boolean;

	/**
	 * Callback when the file is deleted
	 */
	onDelete?: () => void;

	/**
	 * Callback when the file is downloaded
	 */
	onDownload?: () => void;

	/**
	 * Test ID for testing
	 */
	testId?: string;

	/**
	 * Upload progress (0-1) when isUploading is true
	 */
	uploadProgress?: number;
};

/**
 * A file card component that displays file information with actions
 *
 * @see [FileCard](https://developer.atlassian.com/platform/forge/ui-kit/components/file-card/) in UI Kit documentation for more information
 */
export type TFileCard<T> = (props: FileCardProps) => T;