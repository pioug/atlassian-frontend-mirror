/**
 * These types are taken from adf-utils, but not imported to avoid circular dependencies.
 * They can be seen here:
 * https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/editor/adf-utils/src/types/index.ts
 */

/**
 * Represents a mark in the Atlassian Document Format (ADF).
 * Marks are used to apply formatting or metadata to content, such as bold, italic, links, etc.
 *
 * @example
 * ```typescript
 * const boldMark: ADFEntityMark = {
 *   type: 'strong'
 * };
 *
 * const linkMark: ADFEntityMark = {
 *   type: 'link',
 *   attrs: {
 *     href: 'https://example.com',
 *     title: 'Example Link'
 *   }
 * };
 * ```
 */
export interface ADFEntityMark {
	/** The type of mark (e.g., 'strong', 'em', 'link', 'code', etc.) */
	type: string;
	/**
	 * Optional attributes for the mark, containing mark-specific properties.
	 * For example, a link mark would have 'href' and optionally 'title' attributes.
	 */
	attrs?: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[name: string]: any;
	};
}

/**
 * Represents a node or entity in the Atlassian Document Format (ADF).
 * This is the core building block of ADF documents, representing elements like
 * paragraphs, headings, images, tables, and other content types.
 *
 * @example
 * ```typescript
 * const paragraph: ADFEntity = {
 *   type: 'paragraph',
 *   content: [
 *     {
 *       type: 'text',
 *       text: 'Hello world!',
 *       marks: [{ type: 'strong' }]
 *     }
 *   ]
 * };
 *
 * const heading: ADFEntity = {
 *   type: 'heading',
 *   attrs: { level: 1 },
 *   content: [
 *     {
 *       type: 'text',
 *       text: 'Document Title'
 *     }
 *   ]
 * };
 * ```
 */
export interface ADFEntity {
	/** The type of ADF node (e.g., 'doc', 'paragraph', 'heading', 'text', 'image', etc.) */
	type: string;
	/**
	 * Optional attributes for the entity, containing node-specific properties.
	 * For example, a heading node would have a 'level' attribute, an image would have 'src', etc.
	 */
	attrs?: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[name: string]: any;
	};
	/**
	 * Optional array of child entities. Used for container nodes like paragraphs, headings, etc.
	 * Can contain undefined values to handle cases where content might be filtered or removed.
	 */
	content?: Array<ADFEntity | undefined>;
	/**
	 * Optional array of marks applied to this entity.
	 * Marks provide formatting and metadata like bold, italic, links, etc.
	 */
	marks?: Array<ADFEntityMark>;
	/**
	 * Optional text content for text nodes.
	 * Only present on nodes of type 'text'.
	 */
	text?: string;
	/**
	 * Index signature to allow additional properties that may be specific to certain node types
	 * or used for extensions and custom functionality.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}
