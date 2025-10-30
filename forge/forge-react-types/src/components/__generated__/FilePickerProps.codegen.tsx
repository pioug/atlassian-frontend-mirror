/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FilePickerProps
 *
 * @codegen <<SignedSource::f332eb19d077747f3cc76d5a8b197048>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/filepicker/index.tsx <<SignedSource::1563faca9175de1a53e4f304cea93c78>>
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
	 * Callback function to be called when the files are changed
	 */
	onChange?: (files: SerializedFile[]) => void | Promise<void>;
	/**
	 * Test ID for testing
	 */
	testId?: string;
};

export type TFilePicker<T> = (props: FilePickerProps) => T;