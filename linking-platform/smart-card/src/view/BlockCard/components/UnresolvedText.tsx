/** @jsx jsx */
import { css, jsx } from '@emotion/react';

export interface UnresolvedTextProps {
	icon: React.ReactNode;
	text: React.ReactNode;
}

const styles = css({
	display: 'flex',
	alignItems: 'center',
});

export const UnresolvedText = ({ icon, text }: UnresolvedTextProps) => {
	return (
		<span css={styles}>
			{icon}
			{text}
		</span>
	);
};
