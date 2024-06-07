/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CheckboxGroupProps
 *
 * @codegen <<SignedSource::21fc9f2e0d144686e4795ed4c64f0798>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/checkboxgroup/index.tsx <<SignedSource::e4f95cf79182924e927523227eebf6fc>>
 */
export interface CheckboxGroupProps {
	name: string;
	options: { label: string; value: string; isDisabled?: boolean }[];
	value?: string[];
	onChange?: (values: string[]) => void;
	defaultValue?: string[];
	isDisabled?: boolean;
}