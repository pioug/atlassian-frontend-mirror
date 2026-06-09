/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const overflowShadowStyles: SerializedStyles = css({
	backgroundImage: `
		linear-gradient(
			to right,
			${token('color.background.neutral')} ${token('space.300')},
			transparent ${token('space.300')}
		),
		linear-gradient(
			to right,
			${token('elevation.surface.raised')} ${token('space.300')},
			transparent ${token('space.300')}
		),
		linear-gradient(
			to left,
			${token('color.background.neutral')} ${token('space.100')},
			transparent ${token('space.100')}
		),
		linear-gradient(
			to left,
			${token('elevation.surface.raised')} ${token('space.100')},
			transparent ${token('space.100')}
		),
		linear-gradient(
			to left,
			${token('elevation.shadow.overflow.spread')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100')}
		),
		linear-gradient(
			to left,
			${token('elevation.shadow.overflow.perimeter')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100')}
		),
		linear-gradient(
			to right,
			${token('elevation.shadow.overflow.spread')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100')}
		),
		linear-gradient(
			to right,
			${token('elevation.shadow.overflow.perimeter')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100')}
		)
	`,
});
