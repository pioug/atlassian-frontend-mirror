/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CheckboxGroupProps
 *
 * @codegen <<SignedSource::6a61b3ffdd671a5e0084cc2eb8f266ca>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/checkboxgroup/index.tsx <<SignedSource::c9be1ccedca06e7cd599a9ce5aa61fde>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export interface CheckboxGroupProps {
	/**
	 * Sets the initial selected value on the `CheckboxGroup`.
	 */
	defaultValue?: string[];
	/**
	 * Sets the disabled state of all Checkbox elements in the group.
	 */
	isDisabled?: boolean;
	/**
	 * Sets the name prop on each of the Checkbox elements in the group.
	 */
	name: string;
	/*
	 * Function that gets fired after each change event.
	 */
	onChange?: (values: string[]) => void;
	/**
	 * An array of objects, each object is mapped onto a Checkbox element within the group.
	 */
	options: { isDisabled?: boolean; label: string; value: string }[];
	/**
	 * Once set, controls the selected value on the `CheckboxGroup`.
	 */
	value?: string[];
}

/**
 * A Checkbox group is a list of options where one or more choices can be selected.
 *
 * @see [CheckboxGroup](https://developer.atlassian.com/platform/forge/ui-kit/components/checkbox-group/) in UI Kit documentation for more information
 */
export type TCheckboxGroup<T> = (props: CheckboxGroupProps) => T;