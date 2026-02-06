export type RendererAppearance = 'comment' | 'full-page' | 'full-width' | 'max' | undefined;
export type RendererContentMode = 'standard' | 'compact' | undefined;
export type NestedRendererType = 'syncedBlock' | undefined;

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
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: React.ComponentType<React.PropsWithChildren<any>>;
};

export type HeadingAnchorLinksProps = boolean | HeadingAnchorLinksConfig;
