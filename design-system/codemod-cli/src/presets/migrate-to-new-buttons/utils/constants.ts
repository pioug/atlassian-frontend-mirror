export const PRINT_SETTINGS = {
	quote: 'single' as const,
};

/** NEW button **/
export const NEW_BUTTON_ENTRY_POINT = '@atlaskit/button/new';
export const NEW_BUTTON_VARIANTS: {
	[key: string]: string;
} = {
	default: 'Button',
	link: 'LinkButton',
	icon: 'IconButton',
	linkIcon: 'LinkIconButton',
};

/** OLD button **/
export const OLD_BUTTON_ENTRY_POINT = '@atlaskit/button';
export const OLD_BUTTON_VARIANTS: {
	[key: string]: string;
} = {
	loading: 'LoadingButton',
};

export const entryPointsMapping: { [key: string]: string } = {
	Button: '@atlaskit/button/standard-button',
	LoadingButton: '@atlaskit/button/loading-button',
	ButtonGroup: '@atlaskit/button/button-group',
	CustomThemeButton: '@atlaskit/button/custom-theme-button',
};

export const BUTTON_TYPES = [
	'BaseOwnProps',
	'BaseProps',
	'ButtonProps',
	'LoadingButtonProps',
	'LoadingButtonOwnProps',
	'ThemeTokens',
	'ThemeProps',
	'InteractionState',
	'CustomThemeButtonProps',
	'CustomThemeButtonOwnProps',
];

export const UNSAFE_SIZE_PROPS_MAP: Record<string, string> = {
	UNSAFE_size: 'icon',
	UNSAFE_iconAfter_size: 'iconAfter',
	UNSAFE_iconBefore_size: 'iconBefore',
};

export const unsupportedProps = ['component', 'css', 'style'];

export const linkButtonMissingHrefComment = `"link" and "subtle-link" appearances are only available in LinkButton, please either provide a href prop then migrate to LinkButton, or remove the appearance from the default button.`;

export const buttonPropsNoLongerSupportedComment = `Buttons with "component", "css" or "style" prop can't be automatically migrated with codemods. Please migrate it manually.`;

export const migrateFitContainerButtonToDefaultButtonComment = `Migrated to a default button with text which is from the icon label.`;

export const migrateFitContainerButtonToIconButtonComment = `"shouldFitContainer" is not available in icon buttons, please consider using a default button with text.`;

export const customThemeButtonComment = `CustomThemeButton will be deprecated. Please consider migrating to Pressable or Anchor Primitives with custom styles.`;

export const overlayPropComment = `The 'overlay' prop has been deprecated. This only existed in legacy buttons for supporting loading spinners, which can now be achieved in new buttons using the \`isLoading\` prop. Please remove the \`overlay\` prop and consider using the new \`isLoading\` prop.`;

export const loadingButtonComment = ({
	hasLinkAppearance,
	hasHref,
}: {
	hasLinkAppearance: boolean;
	hasHref: boolean;
}) => {
	return `This should be migrated to a new Button with a \`isLoading\` prop. ${hasLinkAppearance ? `"link" and "subtle-link" appearances are not available for new loading buttons."` : ''}${hasHref ? `The \`href\` attribute it not compatible with new loading buttons, because links should not need loading states.` : ''} Please reconsider the design or change the appearance of the button.`;
};
