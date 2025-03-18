/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormProps
 *
 * @codegen <<SignedSource::72d05fe1799ae83e2fbc1e01f76009ce>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/index.tsx <<SignedSource::b6dd991b4a5e73adbac9321d53cd909e>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { ReactNode } from 'react';

export type FormProps = {
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
	children: ReactNode;
};

/**
 * A form allows users to input information.
 *
 * @see [Form](https://developer.atlassian.com/platform/forge/ui-kit/components/form/) in UI Kit documentation for more information
 */
export type TForm<T> = (props: FormProps) => T;