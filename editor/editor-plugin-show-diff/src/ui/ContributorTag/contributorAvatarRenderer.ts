import { bind } from 'bind-event-listener';

import { AVATAR_SIZES } from '@atlaskit/avatar/avatar-sizes';
import { BORDER_WIDTH } from '@atlaskit/avatar/constants/default';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { token } from '@atlaskit/tokens';

import type { TagContributor } from '../../showDiffPluginType';

import { getContributorTagIcon, type ContributorTagIcon } from './contributorTagIcons';

/** Agent kinds with a custom contributor-tag icon. */
const AGENT_KIND_ICONS: Readonly<
	Partial<Record<NonNullable<TagContributor['agentKind']>, ContributorTagIcon>>
> = {
	claude: 'claude',
	rovo: 'rovoHex',
};

/** The size `@atlaskit/avatar`'s `xxsmall` rendered at. */
const AVATAR_SIZE = AVATAR_SIZES.xxsmall;
/** `xxsmall` also carried a `space.025` margin — the same 2px — which is where the ring is painted. */
const AVATAR_RING_WIDTH = BORDER_WIDTH;
const AVATAR_BOX_SIZE = AVATAR_SIZE + AVATAR_RING_WIDTH * 2;

/** Reused from `@atlaskit/avatar`'s `avatar-content`, so the two shapes cannot drift. */
const HEXAGON_CLIP_PATH =
	'polygon(45% 1.33975%, 46.5798% 0.60307%, 48.26352% 0.15192%, 50% 0%, 51.73648% 0.15192%, 53.4202% 0.60307%, 55% 1.33975%, 89.64102% 21.33975%, 91.06889% 22.33956%, 92.30146% 23.57212%, 93.30127% 25%, 94.03794% 26.5798%, 94.48909% 28.26352%, 94.64102% 30%, 94.64102% 70%, 94.48909% 71.73648%, 94.03794% 73.4202%, 93.30127% 75%, 92.30146% 76.42788%, 91.06889% 77.66044%, 89.64102% 78.66025%, 55% 98.66025%, 53.4202% 99.39693%, 51.73648% 99.84808%, 50% 100%, 48.26352% 99.84808%, 46.5798% 99.39693%, 45% 98.66025%, 10.35898% 78.66025%, 8.93111% 77.66044%, 7.69854% 76.42788%, 6.69873% 75%, 5.96206% 73.4202%, 5.51091% 71.73648%, 5.35898% 70%, 5.35898% 30%, 5.51091% 28.26352%, 5.96206% 26.5798%, 6.69873% 25%, 7.69854% 23.57212%, 8.93111% 22.33956%, 10.35898% 21.33975%)';

const boxStyle = convertToInlineCss({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
	boxSizing: 'border-box',
	width: `${AVATAR_BOX_SIZE}px`,
	height: `${AVATAR_BOX_SIZE}px`,
});

const shapeStyle = convertToInlineCss({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	boxSizing: 'border-box',
	width: `${AVATAR_SIZE}px`,
	height: `${AVATAR_SIZE}px`,
	overflow: 'hidden',
});

const imageStyle = convertToInlineCss({
	display: 'block',
	width: '100%',
	height: '100%',
	objectFit: 'cover',
});

/** The `@atlaskit/avatar` image fallback: a subtle glyph on a tinted box. */
const personFallbackStyle = convertToInlineCss({
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: token('color.background.accent.gray.subtler'),
	color: token('color.icon.subtle'),
});

export type ContributorAvatar = {
	destroy: () => void;
	element: HTMLElement;
	/** Repainted when the tag's accent changes, so a state change does not refetch the image. */
	setRingColor: (ringColor: string) => void;
};

/**
 * One 16px avatar for a contributor: a circle for a person, a hexagon for an agent.
 *
 * Mirrors `mentionAvatarRenderer` — a bare `<img>` with a glyph fallback bound to `error`, and the
 * hexagon cut with `clip-path`. The ring `@atlaskit/avatar` drew from `borderColor` is a
 * `box-shadow` on the circle and a second clipped hexagon behind the agent, since `box-shadow` is
 * cut away by `clip-path`.
 */
export const contributorAvatarRenderer = ({
	contributor,
	doc,
	ringColor,
	stackIndex,
}: {
	contributor: TagContributor;
	doc: Document;
	ringColor: string;
	/** Paints the leading avatar of a connected pair over the one it overlaps. */
	stackIndex?: number;
}): ContributorAvatar => {
	const isAgent = contributor.kind === 'agent';
	const element = doc.createElement('span');
	element.setAttribute('style', boxStyle);
	// Decorative: the tag names its contributors in the visually hidden label its screen-reader
	// announcement comes from.
	element.setAttribute('aria-hidden', 'true');
	if (stackIndex !== undefined) {
		element.style.setProperty('z-index', String(stackIndex));
	}

	const shape = doc.createElement('span');
	shape.setAttribute('style', shapeStyle);
	element.appendChild(shape);

	if (isAgent) {
		element.style.setProperty('clip-path', HEXAGON_CLIP_PATH);
		shape.style.setProperty('clip-path', HEXAGON_CLIP_PATH);
	} else {
		shape.style.setProperty('border-radius', token('radius.full'));
	}

	let image: HTMLImageElement | undefined;
	let unbindImageError: (() => void) | undefined;

	const showFallback = () => {
		unbindImageError?.();
		unbindImageError = undefined;
		image?.remove();
		image = undefined;

		if (!isAgent) {
			const fallback = doc.createElement('span');
			fallback.setAttribute('style', personFallbackStyle);
			fallback.appendChild(getContributorTagIcon('person', doc));
			shape.appendChild(fallback);
			return;
		}

		shape.appendChild(
			getContributorTagIcon(AGENT_KIND_ICONS[contributor.agentKind ?? 'external'] ?? 'aiBot', doc),
		);
	};

	if (contributor.avatarUrl) {
		image = doc.createElement('img');
		image.alt = '';
		image.decoding = 'async';
		image.draggable = false;
		image.loading = 'lazy';
		image.setAttribute('style', imageStyle);
		unbindImageError = bind(image, { type: 'error', listener: showFallback });
		shape.appendChild(image);
		image.src = contributor.avatarUrl;
	} else {
		showFallback();
	}

	const setRingColor = (nextRingColor: string) => {
		if (isAgent) {
			element.style.setProperty('background', nextRingColor);
			// Shows through wherever the artwork is transparent, as the avatar background did.
			shape.style.setProperty('background', nextRingColor);
			return;
		}
		shape.style.setProperty('box-shadow', `0 0 0 ${AVATAR_RING_WIDTH}px ${nextRingColor}`);
		shape.style.setProperty('background', nextRingColor);
	};
	setRingColor(ringColor);

	return {
		destroy: () => {
			unbindImageError?.();
			unbindImageError = undefined;
			element.remove();
		},
		element,
		setRingColor,
	};
};
