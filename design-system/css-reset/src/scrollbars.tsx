import { token } from '@atlaskit/tokens';

import evaluateInner from './utils/evaluate-inner';

const scrollbarStyles: string = evaluateInner`/*
 * Feature-gated harmonised scrollbar appearance.
 * Visibility and width remain browser managed.
 */
:root[data-scrollbar-harmonisation] {
  scrollbar-color: ${token('color.border.input', '#8C8F97')} ${token(
		'utility.elevation.surface.current',
		'#FFFFFF',
	)};
}

:root[data-scrollbar-harmonisation] * {
  scrollbar-color: ${token('color.border.input', '#8C8F97')} ${token(
		'utility.elevation.surface.current',
		'#FFFFFF',
	)};
}

:root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent],
:root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent] * {
  scrollbar-color: ${token('color.border.input', '#8C8F97')} transparent;
}

:root[data-scrollbar-harmonisation]::-webkit-scrollbar-track,
:root[data-scrollbar-harmonisation]::-webkit-scrollbar-corner,
:root[data-scrollbar-harmonisation] *::-webkit-scrollbar-track,
:root[data-scrollbar-harmonisation] *::-webkit-scrollbar-corner {
  background-color: ${token('utility.elevation.surface.current', '#FFFFFF')};
  border: 0;
}

:root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent]::-webkit-scrollbar-track,
:root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent]::-webkit-scrollbar-corner,
:root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent] *::-webkit-scrollbar-track,
:root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent] *::-webkit-scrollbar-corner {
  background-color: transparent;
}

:root[data-scrollbar-harmonisation]::-webkit-scrollbar-thumb,
:root[data-scrollbar-harmonisation] *::-webkit-scrollbar-thumb {
  background-color: ${token('color.border.input', '#8C8F97')};
}

@media (forced-colors: active) {
  :root[data-scrollbar-harmonisation],
  :root[data-scrollbar-harmonisation] *,
  :root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent],
  :root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent] * {
    scrollbar-color: auto;
  }

  :root[data-scrollbar-harmonisation]::-webkit-scrollbar-track,
  :root[data-scrollbar-harmonisation]::-webkit-scrollbar-thumb,
  :root[data-scrollbar-harmonisation]::-webkit-scrollbar-corner,
  :root[data-scrollbar-harmonisation] *::-webkit-scrollbar-track,
  :root[data-scrollbar-harmonisation] *::-webkit-scrollbar-thumb,
  :root[data-scrollbar-harmonisation] *::-webkit-scrollbar-corner,
  :root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent]::-webkit-scrollbar-track,
  :root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent]::-webkit-scrollbar-thumb,
  :root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent]::-webkit-scrollbar-corner,
  :root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent] *::-webkit-scrollbar-track,
  :root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent] *::-webkit-scrollbar-thumb,
  :root[data-scrollbar-harmonisation][data-scrollbar-harmonisation-transparent] *::-webkit-scrollbar-corner {
    background-color: revert;
    border: revert;
  }
}`;

export default scrollbarStyles;
