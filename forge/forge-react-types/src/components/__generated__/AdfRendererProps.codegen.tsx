/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - AdfRendererProps
 *
 * @codegen <<SignedSource::757ab113edda1f83f41c49739c285bdc>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/adfrenderer/index.tsx <<SignedSource::f0a45b8f69a7412792758f6a0f31f69d>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { DocNode } from '@atlaskit/adf-schema';

export type AdfRendererProps = {
	/**
	 * An ADF document to render
	 *
	 * @type [DocNode](https://developer.atlassian.com/cloud/jira/platform/apis/document/nodes/doc/)
	 */
	document: DocNode;

	// documentWithoutMedia is only used internally on the Forge side, this is not part of the public API
	documentWithoutMedia?: DocNode;

	/**
	 * A function to determine behaviour for handling unsupported nodes:
	 * - Return a new Node to replace the unsupported one
	 * - Return false to remove the node entirely
	 * - Return undefined to leave the node as-is (default behaviour)
	 *
	 * @type [Visitor](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/master/editor/adf-utils/src/types/index.ts)
	 */
	replaceUnsupportedNode?: Function;
};

/**
 * The AdfRenderer component provides a way to render a valid ADF document, using the same renderer that Atlassian uses internally to render ADF content in Confluence pages, Jira work items, and so on.
 * It allows you to replace node types that are unsupported in the context of a Forge app with replacement content, or remove them entirely.
 * See [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/) for information on valid nodes.
 *
 * This component uses [@atlaskit/renderer](https://www.npmjs.com/package/@atlaskit/renderer) under the hood.
 *
 * Visit [Renderer editor](https://atlaskit.atlassian.com/examples/editor/renderer/basic) for a comprehensive list of different ADF document examples
 *
 * @see [AdfRenderer](https://developer.atlassian.com/platform/forge/ui-kit/components/adfRenderer/) in UI Kit documentation for more information
 */
export type TAdfRenderer<T> = (props: AdfRendererProps) => T;