/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		display: 'grid',
		gridTemplateColumns: '1fr 3fr 1fr 1fr',
		gridTemplateRows: 'auto auto 300px',
		gridTemplateAreas: `
        "banner banner banner banner"
        "top-bar top-bar top-bar top-bar"
        "side-nav main aside panel"
		`,
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		marginBottom: token('space.100'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
		backgroundColor: `linear-gradient(
      45deg,
      ${token('elevation.surface.sunken')} 25%,
      transparent 25%
    ),linear-gradient(
      135deg,
      ${token('elevation.surface.sunken')} 25%,
      transparent 25%
    ),linear-gradient(
      45deg,
      transparent 75%,
      ${token('elevation.surface.sunken')} 75%
    ),linear-gradient(
      135deg,
      transparent 75%,
      ${token('elevation.surface.sunken')} 75%
    )`,
		backgroundPosition: '0 0,10px 0,10px -10px,0px 10px',
		backgroundSize: '20px 20px',
	},
	slot: {
		width: '100%',
		height: '100%',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
	placeholder: {
		width: '100%',
		height: '100%',
		backgroundColor: token('color.background.neutral'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
	bannerSlot: {
		gridArea: 'banner',
	},
	topBarSlot: {
		gridArea: 'top-bar',
		backgroundColor: token('elevation.surface'),
	},
	sideNavSlot: {
		gridArea: 'side-nav',
		backgroundColor: token('elevation.surface'),
	},
	mainSlot: {
		gridArea: 'main',
	},
	asideSlot: {
		gridArea: 'aside',
		paddingInlineStart: token('space.0'),
	},
	panelSlot: {
		gridArea: 'panel',
		paddingInlineStart: token('space.0'),
	},
});

export const PageLayoutDiagram = () => (
	<div css={styles.root}>
		<div css={[styles.slot, styles.bannerSlot]}>
			<div css={styles.placeholder}>Banner</div>
		</div>
		<div css={[styles.slot, styles.topBarSlot]}>
			<div css={styles.placeholder}>Top nav</div>
		</div>
		<div css={[styles.slot, styles.sideNavSlot]}>
			<div css={styles.placeholder}>Side nav</div>
		</div>
		<div css={[styles.slot, styles.mainSlot]}>
			<div css={styles.placeholder}>Main</div>
		</div>
		<div css={[styles.slot, styles.asideSlot]}>
			<div css={styles.placeholder}>Aside</div>
		</div>
		<div css={[styles.slot, styles.panelSlot]}>
			<div css={styles.placeholder}>Panel</div>
		</div>
	</div>
);
