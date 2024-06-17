/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
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
