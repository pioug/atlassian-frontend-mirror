/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - AtlassianTileProps
 *
 * @codegen <<SignedSource::72d1a34de22236fe9bf5d05c4a0550ac>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/atlassiantile/index.tsx <<SignedSource::6d88e2452b049891f2c2b42f6f3035c6>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { ObjectTileSize } from '@atlaskit/object';

export type AtlassianTileType = 'blog' | 'branch' | 'bug' | 'calendar' | 'changes' | 'code' | 'commit' | 'database' | 'epic' | 'idea' | 'improvement' | 'incident' | 'new-feature' | 'page' | 'page-live-doc' | 'problem' | 'pull-request' | 'question' | 'story' | 'subtask' | 'task' | 'whiteboard' | 'work-item';

export type AtlassianTileProps = {
	/**
	 * The glyph type of AtlassianTile to render. This will automatically set the color.
	 * Available options are derived from @atlaskit/object metadata and will
	 * automatically include any new object types added to the design system.
	 */
	glyph: AtlassianTileType;
	/**
	 * Whether the AtlassianTile should be bold in appearance.
	 * Defaults to `false`.
	 */
	isBold?: boolean;
	/**
	 * The label for the AtlassianTile. If decorative, set to empty string.
	 * Defaults to a human-readable version of the icon type.
	 */
	label?: string;
	/**
	 * The size of the tile.
	 * - `xsmall`: 20px
	 * - `small`: 24px
	 * - `medium`: 32px
	 * - `large`: 40px
	 * - `xlarge`: 48px
	 * Defaults to `medium`.
	 */
	size?: ObjectTileSize;
	/**
	 * Test ID for testing
	 */
	testId?: string;
};

/**
 * An AtlassianTile is an icon that represents an Atlassian-specific content type, displayed in a tile.
 * The glyph prop automatically sets the color for the object.
 *
 * @see [AtlassianTile](https://developer.atlassian.com/platform/forge/ui-kit/components/atlassian-tile/) in UI Kit documentation for more information
 */
export type TAtlassianTile<T> = (props: AtlassianTileProps) => T;