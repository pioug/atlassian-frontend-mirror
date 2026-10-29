/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState, type ReactElement, type ReactNode } from 'react';

import { bind } from 'bind-event-listener';

import { cssMap, jsx } from '@atlaskit/css';

const styles = cssMap({
	container: { display: 'grid' },
	layer: { gridArea: '1 / 1', minWidth: 0 },
	reservation: { gridArea: '1 / 1', minWidth: 0, visibility: 'hidden', pointerEvents: 'none' },
});

interface Props {
	fallback: ReactNode;
	localId: string;
	result: ReactNode;
}

/** Keep the native body in layout until Forge finishes its initial rendering. */
export default function ForgeBodiedExtensionHandoff({
	fallback,
	localId,
	result,
}: Props): ReactElement {
	const [ready, setReady] = useState(false);
	const hasResult = Boolean(result);

	useEffect(() => {
		if (!hasResult || ready) {
			return;
		}
		const onReady = (event: MessageEvent) => {
			if (
				event.source === window &&
				event.origin === window.location.origin &&
				event.data?.source === 'forge-extension' &&
				event.data?.type === 'EXTENSION_READY' &&
				event.data?.localId === localId
			) {
				setReady(true);
			}
		};
		const unbind = bind(window, { type: 'message', listener: onReady });
		// Do not retain an invisible body indefinitely if app initialization fails.
		const timeout = window.setTimeout(() => setReady(true), 30000);
		return () => {
			unbind();
			window.clearTimeout(timeout);
		};
	}, [hasResult, localId, ready]);

	return (
		<div css={styles.container}>
			{(!ready || !hasResult) && (
				<div
					css={[styles.layer, hasResult && styles.reservation]}
					aria-hidden={hasResult || undefined}
				>
					{fallback}
				</div>
			)}
			<div css={styles.layer}>{result}</div>
		</div>
	);
}
