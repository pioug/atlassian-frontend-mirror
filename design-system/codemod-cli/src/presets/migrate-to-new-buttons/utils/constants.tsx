/**
 * NEW button *
 */
export const NEW_BUTTON_ENTRY_POINT = '@atlaskit/button/new';
export const NEW_BUTTON_VARIANTS: {
	[key: string]: string;
} = {
	default: 'Button',
	link: 'LinkButton',
	icon: 'IconButton',
	linkIcon: 'LinkIconButton',
};

/**
 * OLD button *
 */
export const OLD_BUTTON_ENTRY_POINT = '@atlaskit/button';

export const linkButtonMissingHrefComment = `"link" and "subtle-link" appearances are not available in the new Button, appearance should be "subtle" or "default".`;

export const noSpacinglinkButtonMissingHrefComment = `"link" and "subtle-link" appearances are not available in the new Button, appearance should be "subtle" or "default", or provide a href prop then migrate to Link.`;

export const buttonPropsNoLongerSupportedComment = `Buttons with "component", "css" or "style" prop can't be automatically migrated with codemods. Please migrate it manually.`;

export const migrateFitContainerButtonToDefaultButtonComment = `Migrated to a default button with text which is from the icon label.`;

export const migrateFitContainerButtonToIconButtonComment = `"shouldFitContainer" is not available in icon buttons, please consider using a default button with text.`;

export const customThemeButtonComment = `CustomThemeButton will be deprecated. Please consider migrating to Pressable or Anchor Primitives with custom styles.`;

export const overlayPropComment = `The 'overlay' prop has been deprecated. This only existed in legacy buttons for supporting loading spinners, which can now be achieved in new buttons using the \`isLoading\` prop. Please remove the \`overlay\` prop and consider using the new \`isLoading\` prop.`;

export const migrateButtonToSubtleLinkButton = `"link" and "subtle-link" appearances are not available in the new Button. Appearance should be migrated to "subtle" or "default" for Link Button, or use Link with "default" appearance.`;

export const migrateSubtleButtonToSubtleLinkButton = `"link" and "subtle-link" appearances are not available in the new Button. Appearance should be migrated to "subtle" or "default" for Link Button, or use Link with "subtle" appearance.`;
