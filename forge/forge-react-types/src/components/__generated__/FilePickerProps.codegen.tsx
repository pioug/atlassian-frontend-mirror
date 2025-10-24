/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FilePickerProps
 *
 * @codegen <<SignedSource::4556b999271f56b8aa2f4d0f9e1375d9>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/filepicker/index.tsx <<SignedSource::1bda27cea60042eb7c1c6e68507f7435>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

type SerializedFile = {
    name: string;
    type: string;
    size: number;
    data: string;
};

export type FilePickerProps = {
  description?: string;
  label?: string;
  onChange?: (files: SerializedFile[]) => void | undefined;
};

export type TFilePicker<T> = (props: FilePickerProps) => T;