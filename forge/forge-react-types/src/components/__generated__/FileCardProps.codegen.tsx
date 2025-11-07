/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FileCardProps
 *
 * @codegen <<SignedSource::5e4cd4ee511a47757b164e01f7e9df18>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/filecard/index.tsx <<SignedSource::299b4e55a3fa01b21b492cf98c3de2f2>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export type FileCardProps = {
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