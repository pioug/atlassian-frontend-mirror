import React, { useEffect, useRef } from 'react';

type WithClassNameProps = {
	className?: string;
};

export function withOverrideCss<T>(Component: React.ComponentType<T>) {
	return (props: T & WithClassNameProps) => {
		const ref = useRef<HTMLElement>(null);

		useEffect(() => {
			if (props?.className && ref.current) {
				ref.current.className = `${ref.current.className} ${props.className}`;
			}
		}, [props?.className]);

		return <Component {...props} ref={ref} />;
	};
}
