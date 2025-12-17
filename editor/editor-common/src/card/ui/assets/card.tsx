import React, { type ComponentProps } from 'react';

// Custom icon ejection - these icons have been migrated away from the deprecated Custom / SVG components to native SVG. Please review whether this icon should be contributed to @atlaskit/icon-lab or whether it can be replaced by an existing icon from either @atlaskit/icon or @atlaskit/icon-lab
const IconCardGlyph = (props: ComponentProps<'svg'>) => {
	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8 9c-1.10457 0-2 .89543-2 2v10c0 1.1046.89543 2 2 2h16c1.1046 0 2-.8954 2-2V11c0-1.10457-.8954-2-2-2H8Zm0 3c0-.5523.44772-1 1-1h2c.5523 0 1 .4477 1 1v2c0 .5523-.4477 1-1 1H9c-.55228 0-1-.4477-1-1v-2Zm5 1c0-.2761.2239-.5.5-.5h10c.2761 0 .5.2239.5.5s-.2239.5-.5.5h-10c-.2761 0-.5-.2239-.5-.5Zm-4 3c-.55228 0-1 .4477-1 1s.44772 1 1 1h14c.5523 0 1-.4477 1-1s-.4477-1-1-1H9Zm-1 4c0-.5523.44772-1 1-1h6c.5523 0 1 .4477 1 1s-.4477 1-1 1H9c-.55228 0-1-.4477-1-1Z"
				fill="currentColor"
			/>
		</svg>
	);
};

export const IconCard = ({ label }: { label: string }): React.JSX.Element => {
	return (
		<IconCardGlyph
			aria-label={label}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '24px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				height: '24px',
			}}
		/>
	);
};
