/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { type PropsWithChildren, useCallback, useState } from 'react';
import Button from '@atlaskit/button/standard-button';
import DragHandlerIcon from '@atlaskit/icon/glyph/drag-handler';
import Lozenge from '@atlaskit/lozenge';
import { token } from '@atlaskit/tokens';
import { type BlockName } from '../constants';
import ChevronIcon from './chevron-icon';

const containerStyles = css({
	borderRadius: '0.25rem',
	boxShadow: token('elevation.shadow.raised', '0px 1px 1px #091E4240, 0px 0px 1px #091E424F'),
	padding: '0.5rem',
});

const headerStyles = css({
	display: 'flex',
	alignItems: 'center',
	h5: {
		flex: '2 0 auto',
		marginTop: 'initial',
	},
});

const contentStyles = css({
	borderTop: `1px solid ${token('color.border', '#091E4224')}`,
	display: 'flex',
	flexDirection: 'column',
	gap: '0.5rem',
	marginTop: '0.5rem',
	paddingTop: '0.5rem',
});

const BlockBuilderContainer = ({
	children,
	internal = false,
	name,
	onRemove,
	position,
	removable = true,
}: PropsWithChildren<{
	internal?: boolean;
	name: BlockName;
	onRemove: (position: number) => void;
	position: number;
	removable: boolean;
}>) => {
	const [open, setOpen] = useState<boolean>(false);
	const handleExpand = useCallback(() => setOpen(!open), [open]);
	const handleOnRemove = useCallback(() => onRemove(position), [onRemove, position]);

	return (
		<div css={containerStyles}>
			<div css={headerStyles}>
				<DragHandlerIcon label="" />
				<h5>
					{name} {internal && <Lozenge>INTERNAL</Lozenge>}
				</h5>
				<Button iconBefore={<ChevronIcon open={open} />} onClick={handleExpand} spacing="compact" />
			</div>
			{open && (
				<div css={contentStyles}>
					{children}
					{removable && (
						<Button shouldFitContainer appearance="danger" onClick={handleOnRemove}>
							Delete
						</Button>
					)}
				</div>
			)}
		</div>
	);
};
export default BlockBuilderContainer;
