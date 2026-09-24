/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormProps
 *
 * @codegen <<SignedSource::2f8dd7d7114730cf87851936f62afaa2>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/index.tsx <<SignedSource::e6435b16ad410a8c39b3daa52b0ff951>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { ReactNode } from 'react';

export type FormProps = {
	children: ReactNode;
	/**
	 * Event handler called when the form is submitted. Fields must be free of validation errors.
	 *
	 * All modules except for `jiraServiceManagement:assetsImportType` must use `() => Promise<void>|void`.
	 *
	 * For the `jiraServiceManagement:assetsImportType` module, the `onSubmit` event handler returns
	 * a `boolean` value indicating if the form is valid (`true`) or invalid (`false`).
	 * If you use `() => Promise<void>|void` for this module, it will default to true.
	 */
	onSubmit: () => Promise<void | boolean> | void;
};

/**
 * A form allows users to input information.
 *
 * @see [Form](https://developer.atlassian.com/platform/forge/ui-kit/components/form/) in UI Kit documentation for more information
 */
export type TForm<T> = (props: FormProps) => T;