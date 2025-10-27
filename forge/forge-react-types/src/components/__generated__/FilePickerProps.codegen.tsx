/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FilePickerProps
 *
 * @codegen <<SignedSource::5d73fae2f947d6bb42aa42c89624ad67>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/filepicker/index.tsx <<SignedSource::47d9000bc6265446cc40547ca8d46787>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

type SerializedFile = {
	data: string;
	name: string;
	size: number;
	type: string;
};

export type FilePickerProps = {
	/**
	 * Description of the file picker to be used for file requirements
	 */
	description?: string;
	/**
	 * Label of the file picker
	 */
	label?: string;
	/**
	 * Test ID for testing
	 */
	testId?: string;
	/**
	 * Callback function to be called when the files are changed
	 */
	onChange?: (files: SerializedFile[]) => void | undefined;
};

export type TFilePicker<T> = (props: FilePickerProps) => T;