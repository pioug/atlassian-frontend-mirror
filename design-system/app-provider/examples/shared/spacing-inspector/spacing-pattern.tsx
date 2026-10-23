import React, { useId } from 'react';

import { token } from '@atlaskit/tokens';

type SpacingKind = 'gap' | 'inset';

export function SpacingPattern({
	id,
	kind,
	color,
}: {
	id: string;
	kind: SpacingKind;
	color: string;
}): React.JSX.Element {
	return (
		<pattern
			id={id}
			patternUnits="userSpaceOnUse"
			width={6}
			height={6}
			patternTransform={kind === 'gap' ? 'rotate(45)' : 'rotate(-45)'}
		>
			<rect width={6} height={6} fill={color} fillOpacity={0.12} />
			<path d="M 0 0 V 6" stroke={color} strokeWidth={2} />
		</pattern>
	);
}

export function SpacingSwatch({ kind }: { kind: SpacingKind }): React.JSX.Element {
	const id = useId();
	return (
		<svg width={24} height={16} viewBox="0 0 24 16" aria-hidden="true" focusable="false">
			<defs>
				<SpacingPattern id={id} kind={kind} color={token('color.icon')} />
			</defs>
			<rect width={24} height={16} fill={`url(#${id})`} fillOpacity={0.5} />
		</svg>
	);
}
