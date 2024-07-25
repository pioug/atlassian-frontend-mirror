/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { PropsWithChildren } from 'react';
import { useCallback, useState } from 'react';
import { IconButton } from '@atlaskit/button/new';
import ChevronIcon from './chevron-icon';

const containerStyles = css({
	marginTop: '0.5rem',
	padding: '0.1rem 0',
});
const headerStyles = css({
	display: 'flex',
	alignItems: 'center',
	cursor: 'pointer',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h6: {
		flex: '2 0 auto',
	},
});
const Fieldset = ({
	children,
	defaultOpen = true,
	legend,
}: PropsWithChildren<{
	legend?: string;
	defaultOpen?: boolean;
}>) => {
	const [open, setOpen] = useState<boolean>(defaultOpen);
	const handleOnClick = useCallback(() => setOpen(!open), [open]);

	return (
		<div css={containerStyles}>
			<div css={headerStyles} onClick={handleOnClick}>
				<h6>{legend}</h6>
				<IconButton spacing="compact" icon={() => <ChevronIcon open={open} />} label="" />
			</div>
			{open && children}
		</div>
	);
};

export default Fieldset;
