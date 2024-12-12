/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CheckboxGroupProps
 *
 * @codegen <<SignedSource::293ea13e93c4a78fe93d7192e0bdaddb>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/checkboxgroup/index.tsx <<SignedSource::e4f95cf79182924e927523227eebf6fc>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export interface CheckboxGroupProps {
	name: string;
	options: { label: string; value: string; isDisabled?: boolean }[];
	value?: string[];
	onChange?: (values: string[]) => void;
	defaultValue?: string[];
	isDisabled?: boolean;
}