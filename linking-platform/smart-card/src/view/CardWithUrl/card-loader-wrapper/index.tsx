import React, { forwardRef } from 'react';

import type { CardProps } from '../../Card';

type CardLoaderWrapperProps = Pick<CardProps, 'appearance'>;
const CardLoaderWrapper: React.ForwardRefExoticComponent<
	CardLoaderWrapperProps & {
		children?: React.ReactNode | undefined;
	} & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, React.PropsWithChildren<CardLoaderWrapperProps>>(
	({ appearance, children }, ref) => {
		const Component = appearance === 'inline' ? 'span' : 'div';

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			<Component className="loader-wrapper" ref={ref}>
				{children}
			</Component>
		);
	},
);

export default CardLoaderWrapper;
