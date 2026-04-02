/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
import React, { createContext, type ReactNode, useContext, useState } from 'react';

import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover';

const ForceFallbackContext = createContext<boolean>(false);

/**
 * Read whether the JS fallback is being forced by the example wrapper.
 */
export function useForceFallback(): boolean {
	return useContext(ForceFallbackContext);
}

/**
 * Wraps an example with a fixed toggle in the top-right corner that
 * lets you force the JavaScript fallback for anchor positioning.
 *
 * Children receive the `forceFallbackPositioning` value through context, which can
 * be read with `useForceFallback()` or passed directly to `<Popup>`.
 *
 * Uses `<Popover mode="manual" isOpen>` so the toggle lives in the top layer
 * rather than relying on `position: fixed` and `z-index`.
 *
 * @example
 * ```tsx
 * export default function MyExample() {
 *   return (
 *     <ForceFallbackToggle>
 *       {(forceFallbackPositioning) => (
 *         <Popup placement="block-end" onClose={fn} forceFallbackPositioning={forceFallbackPositioning}>
 *           …
 *         </Popup>
 *       )}
 *     </ForceFallbackToggle>
 *   );
 * }
 * ```
 */
export function ForceFallbackToggle({
	children,
}: {
	children: ReactNode | ((forceFallbackPositioning: boolean) => ReactNode);
}): React.JSX.Element {
	const [forceFallbackPositioning, setForceFallback] = useState(false);

	return (
		<ForceFallbackContext.Provider value={forceFallbackPositioning}>
			<Popover mode="manual" isOpen>
				<label
					htmlFor="force-fallback-toggle"
					style={{
						position: 'fixed',
						top: 8,
						right: 8,
						display: 'flex',
						alignItems: 'center',
						gap: 6,
						padding: '4px 10px',
						borderRadius: 6,
						border: '1px solid #ddd',
						background: forceFallbackPositioning ? '#fff3cd' : '#fff',
						fontSize: 12,
						fontFamily: token('font.family.body'),
						cursor: 'pointer',
						userSelect: 'none',
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
					}}
				>
					<input
						id="force-fallback-toggle"
						type="checkbox"
						checked={forceFallbackPositioning}
						onChange={(e) => setForceFallback(e.target.checked)}
						style={{ margin: 0 }}
					/>
					JS fallback
				</label>
			</Popover>
			{typeof children === 'function' ? children(forceFallbackPositioning) : children}
		</ForceFallbackContext.Provider>
	);
}
