export type RendererAppearance =
	// Note: this comment is replicated in packages/editor/editor-core/src/types/editor-props.ts
	// any changes should be made in both locations
	/*
  Configure the display mode of the editor. Different modes may have different feature sets supported.

  - `comment` - should be used for things like comments where you have a field input but require a toolbar & save/cancel buttons
  - `full-page` - should be used for a full page editor where it is the user focus of the page
  - `chromeless` - is essentially the `comment` editor but without the editor chrome, like toolbar & save/cancel buttons
  */
	'comment' | 'full-page' | 'full-width' | undefined;

/**
 * DO NOT USE THESE OPTIONS
 * These StickyHeaderConfig_DO_NOT_USE options are being TEMPORARILY added so Confluence can use Sticky Table Headers
 * in Nav4.
 *
 * They will be cleaned up ASAP after Confluence refactors its page layout to add an explicit scroll container (DISCO-3121)
 *
 * `defaultScrollRootId_DO_NOT_USE` - defaults to undefined - can be used to specify the id of default OverflowParent if
 *      the table doesn't have a parent that explicitly specifies `overflow: scroll` or `overflow-y: scroll`. When undefined,
 *      the default OverflowParent will be the window
 * `shouldAddDefaultScrollRootOffsetTop_DO_NOT_USE` - defaults to false - can be used to specify that if the OverflowParent
 *      is the default one specificed, then the sticky table header offset should include the OverflowParent offset.
 *      This is required because the logic that determines if the header should be sticky always takes the OverflowParent.offsetTop
 *      into account. But the calculation to get the actual header offset does not.
 */
type StickyHeaderConfig_DO_NOT_USE = {
	defaultScrollRootId_DO_NOT_USE?: string;
	shouldAddDefaultScrollRootOffsetTop_DO_NOT_USE?: boolean;
};

export type StickyHeaderConfig = {
	offsetTop?: number;
} & StickyHeaderConfig_DO_NOT_USE;

export type StickyHeaderProps =
	| boolean
	| ({
			show?: boolean;
	  } & StickyHeaderConfig);

export type HeadingAnchorLinksConfig = {
	activeHeadingId?: string;
	allowNestedHeaderLinks?: boolean;
};

export type NodeComponentsProps = {
	[key: string]: React.ComponentType<React.PropsWithChildren<any>>;
};

export type HeadingAnchorLinksProps = boolean | HeadingAnchorLinksConfig;
