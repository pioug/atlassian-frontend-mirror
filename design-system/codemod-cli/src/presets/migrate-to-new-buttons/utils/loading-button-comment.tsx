export const loadingButtonComment = ({
	hasLinkAppearance,
	hasHref,
}: {
	hasLinkAppearance: boolean;
	hasHref: boolean;
}) => {
	return `This should be migrated to a new Button with a \`isLoading\` prop. ${
		hasLinkAppearance
			? `"link" and "subtle-link" appearances are not available for new loading buttons."`
			: ''
	}${
		hasHref
			? `The \`href\` attribute it not compatible with new loading buttons, because links should not need loading states.`
			: ''
	} Please reconsider the design or change the appearance of the button.`;
};
