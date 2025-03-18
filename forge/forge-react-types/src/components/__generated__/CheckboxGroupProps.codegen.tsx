/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CheckboxGroupProps
 *
 * @codegen <<SignedSource::63e9cf6f2e444db397f9e170b4e1ce7b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/checkboxgroup/index.tsx <<SignedSource::4db9e0c029805d1c1fd28b923f3dbae3>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export interface CheckboxGroupProps {
	/**
	 * Sets the name prop on each of the Checkbox elements in the group.
	 */
	name: string;
	/**
	 * An array of objects, each object is mapped onto a Checkbox element within the group.
	 */
	options: { label: string; value: string; isDisabled?: boolean }[];
	/**
	 * Once set, controls the selected value on the `CheckboxGroup`.
	 */
	value?: string[];
	/*
	 * Function that gets fired after each change event.
	 */
	onChange?: (values: string[]) => void;
	/**
	 * Sets the initial selected value on the `CheckboxGroup`.
	 */
	defaultValue?: string[];
	/**
	 * Sets the disabled state of all Checkbox elements in the group.
	 */
	isDisabled?: boolean;
}

/**
 * A Checkbox group is a list of options where one or more choices can be selected.
 *
 * @see [CheckboxGroup](https://developer.atlassian.com/platform/forge/ui-kit/components/checkbox-group/) in UI Kit documentation for more information
 */
export type TCheckboxGroup<T> = (props: CheckboxGroupProps) => T;