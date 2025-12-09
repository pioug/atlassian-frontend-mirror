/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { bindAll, type UnbindFn } from 'bind-event-listener';

import Button from '@atlaskit/button/new';
import { CodeBlock } from '@atlaskit/code';
import { cssMap, jsx } from '@atlaskit/css';
import Portal, {
	PORTAL_MOUNT_EVENT,
	PORTAL_UNMOUNT_EVENT,
	type PortalEvent,
} from '@atlaskit/portal';
import { Box } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		marginBlockEnd: token('space.200'),
		marginBlockStart: token('space.200'),
		marginInlineEnd: token('space.200'),
		marginInlineStart: token('space.200'),
	},
	verticalSpaceContainer: {
		marginBlockEnd: token('space.200'),
	},
	portalContent: {
		marginBlockEnd: token('space.200'),
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.200'),
		marginInlineStart: token('space.0'),
	},
	figure: {
		marginBlockEnd: token('space.0'),
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.0'),
		marginInlineStart: token('space.0'),
	},
});

const PortalEventExample = (): JSX.Element => {
	const [isMounted, setIsMounted] = useState(false);
	const [customEventData, setCustomEventData] = useState('');

	useEffect(() => {
		const portalEventListener = ((event: PortalEvent) => {
			const { type, detail } = event;

			setCustomEventData(JSON.stringify({ type, detail }));
		}) as EventListener;

		const unbind: UnbindFn = bindAll(window, [
			{
				type: PORTAL_MOUNT_EVENT,
				listener: portalEventListener,
			},
			{
				type: PORTAL_UNMOUNT_EVENT,
				listener: portalEventListener,
			},
		]);

		return unbind;
	}, []);

	return (
		<Box xcss={styles.container}>
			<Box xcss={styles.verticalSpaceContainer}>
				<Button appearance="primary" onClick={() => setIsMounted(!isMounted)}>
					{isMounted ? 'Unmount' : 'Mount'} portal
				</Button>
			</Box>
			<div>
				<figure css={styles.figure}>
					<figcaption>PortalEvent specific data:</figcaption>
					<CodeBlock language="JSON" text={customEventData} />
				</figure>
			</div>
			{isMounted && (
				<Portal>
					<Box xcss={styles.portalContent}>
						<SectionMessage>I am inside portal!</SectionMessage>
					</Box>
				</Portal>
			)}
		</Box>
	);
};

export default PortalEventExample;
