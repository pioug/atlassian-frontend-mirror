import React, { type ComponentProps } from 'react';

// Custom icon ejection - these icons have been migrated away from the deprecated Custom / SVG components to native SVG. Please review whether this icon should be contributed to @atlaskit/icon-lab or whether it can be replaced by an existing icon from either @atlaskit/icon or @atlaskit/icon-lab
const BorderIconGlyph = ({
	'aria-label': ariaLabel,
	style,
}: Pick<ComponentProps<'svg'>, 'aria-label' | 'style'>) => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-label={ariaLabel}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- style prop passed through from parent component
			style={style}
		>
			<path
				d="M8.33333 8C8.15267 8 8 8.14933 8 8.33333V15.6667C8.0007 15.7549 8.03604 15.8392 8.0984 15.9016C8.16076 15.964 8.24514 15.9993 8.33333 16H15.6667C15.8473 16 16 15.8507 16 15.6667V8.33333C16 8.15267 15.8507 8 15.6667 8H8.33333Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4 7C4 5.34315 5.34315 4 7 4H17C18.6569 4 20 5.34315 20 7V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7ZM7 6C6.44772 6 6 6.44772 6 7V17C6 17.5523 6.44772 18 7 18H17C17.5523 18 18 17.5523 18 17V7C18 6.44772 17.5523 6 17 6H7Z"
				fill="currentColor"
			/>
		</svg>
	);
};

export const BorderIcon = ({ label }: { label: string }): React.JSX.Element => {
	return <BorderIconGlyph aria-label={label} />;
};
