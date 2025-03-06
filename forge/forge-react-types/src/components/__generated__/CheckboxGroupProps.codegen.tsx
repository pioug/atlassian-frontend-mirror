/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CheckboxGroupProps
 *
 * @codegen <<SignedSource::89e98a25ac16f92b5d18b061bb6fce57>>
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
 */
export type TCheckboxGroup<T> = (props: CheckboxGroupProps) => T;