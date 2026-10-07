/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

const styles = cssMap({
	root: {
		minWidth: '340px',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		boxSizing: 'border-box',
	},
});

interface FullPageEditorWrapperProps {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export const FullPageEditorWrapperCompiled: React.ForwardRefExoticComponent<
	FullPageEditorWrapperProps & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, FullPageEditorWrapperProps>(
	({ children, className, style }, ref) => (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<div css={styles.root} ref={ref} className={className} style={style}>
			{children}
		</div>
	),
);
