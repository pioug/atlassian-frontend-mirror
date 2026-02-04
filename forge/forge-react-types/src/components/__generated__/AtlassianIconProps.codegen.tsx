/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - AtlassianIconProps
 *
 * @codegen <<SignedSource::48d2fe2d1559dde01c83341d7d963d7f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/atlassianicon/index.tsx <<SignedSource::953d41a93d1452a3e634edd32d3f49de>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

export type AtlassianIconType = 'blog' | 'branch' | 'bug' | 'calendar' | 'changes' | 'code' | 'commit' | 'database' | 'epic' | 'idea' | 'improvement' | 'incident' | 'new-feature' | 'page' | 'page-live-doc' | 'problem' | 'pull-request' | 'question' | 'story' | 'subtask' | 'task' | 'whiteboard' | 'work-item';

export type AtlassianIconProps = {
  /**
   * The glyph type of AtlassianIcon to render. This will automatically set the color.
   * Available options are derived from @atlaskit/object metadata and will
   * automatically include any new object types added to the design system.
   */
  glyph: AtlassianIconType;
  /**
   * The label for the AtlassianIcon. If decorative, set to empty string.
   */
  label?: string;
  /**
   * The size of the AtlassianIcon: 'small' (12px) or 'medium' (16px).
   */
  size?: 'small' | 'medium';
	/**
   * Test ID for testing
   */
  testId?: string;
};

/**
 * An AtlassianIcon is an icon that represents an Atlassian-specific content type.
 * The glyph prop automatically sets the color for the object.
 *
 * @see [AtlassianIcon](https://developer.atlassian.com/platform/forge/ui-kit/components/atlassian-icon/) in UI Kit documentation for more information
 */
export type TAtlassianIcon<T> = (props: AtlassianIconProps) => T;