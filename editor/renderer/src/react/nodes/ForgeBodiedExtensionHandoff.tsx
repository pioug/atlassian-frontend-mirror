/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useMemo, useState, type ReactElement, type ReactNode } from 'react';

import { bind } from 'bind-event-listener';

import { cssMap, jsx } from '@atlaskit/css';

import { ForgeBodiedExtensionHandoffReadyContext } from './forgeBodiedExtensionHandoffContext';

const styles = cssMap({
	container: { display: 'grid' },
	layer: { gridArea: '1 / 1', minWidth: 0 },
	reservation: { gridArea: '1 / 1', minWidth: 0, visibility: 'hidden', pointerEvents: 'none' },
});

interface Props {
	fallback: ReactNode;
	localId: string;
	preserveContentUntilReady?: boolean;
	result: ReactNode;
	suppressInitialFallback?: boolean;
}

/** Keep the native body in layout until Forge finishes its initial rendering. */
export default function ForgeBodiedExtensionHandoff({
	fallback,
	localId,
	result,
	preserveContentUntilReady = false,
	suppressInitialFallback = false,
}: Props): ReactElement {
	const [ready, setReady] = useState(false);
	const hasResult = Boolean(result);
	const handoff = useMemo(
		() =>
			preserveContentUntilReady && !ready ? { localId, onReady: () => setReady(true) } : undefined,
		[localId, preserveContentUntilReady, ready],
	);
	const showNativeBody = preserveContentUntilReady && !ready;

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
		const unbind = preserveContentUntilReady
			? undefined
			: bind(window, { type: 'message', listener: onReady });
		// Release stalled or intentionally empty apps rather than retaining the server body forever.
		const timeout = window.setTimeout(() => setReady(true), 30000);
		return () => {
			unbind?.();
			window.clearTimeout(timeout);
		};
	}, [hasResult, localId, ready, preserveContentUntilReady]);

	return (
		<div css={styles.container}>
			{(!ready || !hasResult) && (
				<div
					css={[styles.layer, hasResult && !showNativeBody && styles.reservation]}
					aria-hidden={(hasResult && !showNativeBody) || undefined}
				>
					{suppressInitialFallback && !ready ? null : fallback}
				</div>
			)}
			<div
				css={[styles.layer, showNativeBody && styles.reservation]}
				aria-hidden={showNativeBody || undefined}
			>
				<ForgeBodiedExtensionHandoffReadyContext.Provider value={handoff}>
					{result}
				</ForgeBodiedExtensionHandoffReadyContext.Provider>
			</div>
		</div>
	);
}
