/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors -- Animated glyphs are injected HTML strings, so inner elements can only be styled via nested selectors on the wrapper. */
import { type ForwardRefExoticComponent, forwardRef, type RefAttributes, useMemo } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Icon from '../components/icon-new';
import { useAnimatedIconPlayback } from '../components/use-animated-icon-playback';
import { useSvgMaskId } from '../components/use-svg-mask-id';
import type { AnimatedIconProps, AnimatedIconRef } from '../types';

// Strokes will undraw from 0-700ms (shade), then snap to the opposite end and hold until 800ms.
// Strokes will redraw from 800-1400ms.
const TIMELINE = [
	{ phase: 'shade', durationMs: 700 },
	{ phase: 'hold', durationMs: 100 },
	{ phase: 'redraw', durationMs: 600 },
] as const;

const animatedStyles = cssMap({
	base: {
		'& [data-anim]': {
			transitionProperty: 'stroke-dashoffset',
			transitionTimingFunction: 'cubic-bezier(0.42, 0, 0.58, 1)',
			transitionDuration: '600ms',
		},
		'& [data-anim="trim0"]': {
			strokeDashoffset: '0',
		},
		'& [data-anim="trim1"]': {
			strokeDashoffset: '9.982',
		},
		'& [data-anim="trim2"]': {
			strokeDashoffset: '12.262',
		},
		'& [data-anim="trim3"]': {
			strokeDashoffset: '14.432',
		},
		'& [data-anim="trim4"]': {
			strokeDashoffset: '16.45',
		},
		'& [data-anim="trim5"]': {
			strokeDashoffset: '18.295',
		},
		'& [data-anim="trim6"]': {
			strokeDashoffset: '35.551',
		},
		'& [data-anim="trim7"]': {
			strokeDashoffset: '38.52',
		},
		'& [data-anim="trim8"]': {
			strokeDashoffset: '41.695',
		},
		'& [data-anim="trim9"]': {
			strokeDashoffset: '44.859',
		},
		'& [data-anim="trim10"]': {
			strokeDashoffset: '47.819',
		},
		'& [data-anim="trim11"]': {
			strokeDashoffset: '50.441',
		},
		'& [data-anim="trim12"]': {
			strokeDashoffset: '52.848',
		},
		'& [data-anim="trim13"]': {
			strokeDashoffset: '55.475',
		},
		'& [data-anim="trim14"]': {
			strokeDashoffset: '58.979',
		},
	},
	interactionShade: {
		'& [data-anim]': {
			transitionDuration: '700ms',
		},
		'& [data-anim="trim0"]': {
			strokeDashoffset: '-100',
		},
		'& [data-anim="trim1"]': {
			strokeDashoffset: '-90.018',
		},
		'& [data-anim="trim2"]': {
			strokeDashoffset: '-87.738',
		},
		'& [data-anim="trim3"]': {
			strokeDashoffset: '-85.562',
		},
		'& [data-anim="trim4"]': {
			strokeDashoffset: '-83.55',
		},
		'& [data-anim="trim5"]': {
			strokeDashoffset: '-81.705',
		},
		'& [data-anim="trim6"]': {
			strokeDashoffset: '-64.449',
		},
		'& [data-anim="trim7"]': {
			strokeDashoffset: '-61.48',
		},
		'& [data-anim="trim8"]': {
			strokeDashoffset: '-58.305',
		},
		'& [data-anim="trim9"]': {
			strokeDashoffset: '-55.141',
		},
		'& [data-anim="trim10"]': {
			strokeDashoffset: '-51.181',
		},
		'& [data-anim="trim11"]': {
			strokeDashoffset: '-49.559',
		},
		'& [data-anim="trim12"]': {
			strokeDashoffset: '-47.152',
		},
		'& [data-anim="trim13"]': {
			strokeDashoffset: '-44.525',
		},
		'& [data-anim="trim14"]': {
			strokeDashoffset: '-41.021',
		},
	},
	interactionRedraw: {
		'& [data-anim]': {
			transitionDuration: '0ms',
		},
		'& [data-anim="trim0"]': {
			strokeDashoffset: '100',
		},
		'& [data-anim="trim1"]': {
			strokeDashoffset: '109.982',
		},
		'& [data-anim="trim2"]': {
			strokeDashoffset: '112.262',
		},
		'& [data-anim="trim3"]': {
			strokeDashoffset: '114.432',
		},
		'& [data-anim="trim4"]': {
			strokeDashoffset: '116.45',
		},
		'& [data-anim="trim5"]': {
			strokeDashoffset: '118.295',
		},
		'& [data-anim="trim6"]': {
			strokeDashoffset: '135.551',
		},
		'& [data-anim="trim7"]': {
			strokeDashoffset: '138.52',
		},
		'& [data-anim="trim8"]': {
			strokeDashoffset: '141.695',
		},
		'& [data-anim="trim9"]': {
			strokeDashoffset: '144.859',
		},
		'& [data-anim="trim10"]': {
			strokeDashoffset: '147.819',
		},
		'& [data-anim="trim11"]': {
			strokeDashoffset: '150.441',
		},
		'& [data-anim="trim12"]': {
			strokeDashoffset: '152.848',
		},
		'& [data-anim="trim13"]': {
			strokeDashoffset: '155.475',
		},
		'& [data-anim="trim14"]': {
			strokeDashoffset: '158.979',
		},
	},
});

// The mask id must be unique per instance: `url(#id)` resolves to the first match in the document, so a shared
// id would draw every instance through the first instance's (animated) mask.
const getGlyph = (maskId: string): string => `
  <defs>
    <mask id="${maskId}" maskUnits="userSpaceOnUse" x="-4" y="-4" width="26" height="26">
      <path data-anim="trim0" d="M0.4 11.4C1.28 10.71 2.49 9.81 3.52 8.83C3.577 8.776 3.633 8.722 3.689 8.668" stroke="white" stroke-width="1.6" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="10.559364964499128" stroke-dasharray="100 200" />
      <path data-anim="trim1" d="M3.52 8.83C3.748 8.615 3.966 8.396 4.171 8.175C4.223 8.12 4.273 8.064 4.322 8.009" stroke="white" stroke-width="1.7125000000000001" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="2.8350628634153336" stroke-dasharray="100 200" />
      <path data-anim="trim2" d="M4.171 8.175C4.376 7.954 4.568 7.73 4.74 7.505C4.783 7.449 4.825 7.392 4.866 7.336" stroke="white" stroke-width="1.9375" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="2.6899939445263787" stroke-dasharray="100 200" />
      <path data-anim="trim3" d="M4.74 7.505C4.913 7.28 5.066 7.054 5.196 6.828C5.229 6.771 5.26 6.714 5.289 6.658" stroke="white" stroke-width="2.1625" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="2.495162132774421" stroke-dasharray="100 200" />
      <path data-anim="trim4" d="M5.196 6.828C5.326 6.601 5.433 6.375 5.51 6.15C5.568 5.983 5.624 5.8 5.674 5.61" stroke="white" stroke-width="2.3875" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="3.23807847092582" stroke-dasharray="100 200" />
      <path data-anim="trim5" d="M5.51 6.15C5.74 5.48 5.95 4.57 5.86 3.93C5.63 2.26 2.67 2.22 2.45 4.07C2.439 4.164 2.43 4.259 2.423 4.357" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="17.967504490129432" stroke-dasharray="100 200" />
      <path data-anim="trim6" d="M2.45 4.07C2.405 4.445 2.396 4.852 2.42 5.271C2.426 5.376 2.435 5.481 2.445 5.587" stroke="white" stroke-width="2.4" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="3.7514147679832077" stroke-dasharray="100 200" />
      <path data-anim="trim7" d="M2.42 5.271C2.445 5.69 2.504 6.121 2.595 6.544C2.618 6.65 2.643 6.755 2.67 6.859" stroke="white" stroke-width="2.2" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="3.974982613770095" stroke-dasharray="100 200" />
      <path data-anim="trim8" d="M2.595 6.544C2.686 6.967 2.81 7.382 2.965 7.77C3.003 7.867 3.044 7.962 3.086 8.055" stroke="white" stroke-width="2" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="3.9302278785364813" stroke-dasharray="100 200" />
      <path data-anim="trim9" d="M2.965 7.77C3.119 8.158 3.305 8.518 3.52 8.83C3.573 8.908 3.628 8.982 3.685 9.054" stroke="white" stroke-width="1.7999999999999998" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="3.6456091815109692" stroke-dasharray="100 200" />
      <path data-anim="trim10" d="M3.52 8.83C3.733 9.14 3.974 9.404 4.243 9.602C4.31 9.652 4.379 9.697 4.449 9.738" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="3.2331884525744927" stroke-dasharray="100 200" />
      <path data-anim="trim11" d="M4.243 9.602C4.511 9.8 4.808 9.933 5.13 9.981C5.211 9.993 5.293 10 5.377 10.001" stroke="white" stroke-width="2" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="3.017848308121467" stroke-dasharray="100 200" />
      <path data-anim="trim12" d="M5.13 9.981C5.453 10.029 5.801 9.993 6.175 9.852C6.268 9.817 6.363 9.776 6.46 9.727" stroke="white" stroke-width="2.2" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="3.396019709508631" stroke-dasharray="100 200" />
      <path data-anim="trim13" d="M6.175 9.852C6.549 9.712 6.948 9.468 7.37 9.1C7.545 8.948 7.684 8.755 7.8 8.538" stroke="white" stroke-width="2.4" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="5.260639066313564" stroke-dasharray="100 200" />
      <path data-anim="trim14" d="M7.37 9.1C8.07 8.49 8.19 7.24 8.64 6.34C9.44 7.51 7.59 10.92 10.64 10.07C12.11 9.66 11.8 8.82 12.36 7.63C13.14 9.16 12.26 9.62 14.32 10.17C14.82 10.3 15.32 10.37 15.82 10.46" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="butt" stroke-linejoin="round" pathLength="41.02127642888569" stroke-dasharray="100 200" />
    </mask>
  </defs>
  <path d="M16 14H0v-1.5h16z" fill="currentColor"/>
  <g fill-opacity="0.4">
    <path d="M2.83 2.27c.62-.41 1.4-.47 2.24-.24.58.15 1.03.48 1.32.95.28.45.39.98.38 1.49-.02 1.01-.47 2.14-1.16 3.1-.33.46-.74.93-1.18 1.38q.03.03.05.06c.32.33.62.48.88.5.24.02.57-.05.99-.44.44-.4.94-1.09 1.47-2.23a.75.75 0 0 1 1.42.46v.02l-.01.08c-.01.07-.02.18-.04.31-.02.26-.03.59.01.9.05.32.14.56.25.7.09.11.23.21.55.21.83 0 1.35-.56 1.53-1.21a.75.75 0 0 1 1.47.15v-.01.02a1.1 1.1 0 0 0 .22.46c.19.23.65.6 1.78.6V11c-1.35 0-2.23-.41-2.77-.96.36-.4.61-.87.74-1.33l-.72-.21.75-.05-.75.05c-.75.05-.75.06-.75.06v.02a1 1 0 0 0 .02.13q.02.12.08.3a2.6 2.6 0 0 0 .63 1.03c-.51.56-1.25.96-2.23.96-.74 0-1.32-.28-1.71-.76a2.4 2.4 0 0 1-.38-.66c.44-.55.87-1.25 1.27-2.13l-.68-.31-.73-.15V7l-.01.03-.02.12a6 6 0 0 0-.05.4 5.6 5.6 0 0 0 .02 1.25c.04.25.1.52.2.78q-.27.33-.55.58c-.65.6-1.38.89-2.13.82-.73-.06-1.34-.45-1.82-.94l-.06-.06q-.17.15-.32.29a35 35 0 0 1-1.54 1.29l-.02.02-.01.01L1 11l-.46-.59h.01l.02-.02a24 24 0 0 0 .41-.32 34 34 0 0 0 1.51-1.33 7 7 0 0 1-.24-.51c-.57-1.33-.84-2.99-.52-4.28.16-.65.49-1.29 1.1-1.69m.79 5.35c.29-.32.56-.63.77-.93.56-.79.86-1.63.88-2.26.01-.31-.06-.52-.14-.66-.08-.12-.2-.23-.44-.3-.56-.15-.87-.06-1.04.05-.18.12-.36.36-.46.79-.21.87-.05 2.17.44 3.31" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
    <path d="M7.91 9.58c.44-.55.87-1.25 1.27-2.13l-.68-.31-.73-.15V7l-.01.03-.02.12a6 6 0 0 0-.05.4 5.6 5.6 0 0 0 .02 1.25c.04.25.1.52.2.78m4.32.46c.36-.4.61-.87.74-1.33l-.72-.21c-.75.05-.75.06-.75.06v.02a1 1 0 0 0 .02.13q.02.12.08.3a2.6 2.6 0 0 0 .63 1.03" fill="currentColor"/>
  </g>
  <g mask="url(#${maskId})">
    <path d="M2.83 2.27c.62-.41 1.4-.47 2.24-.24.58.15 1.03.48 1.32.95.28.45.39.98.38 1.49-.02 1.01-.47 2.14-1.16 3.1-.33.46-.74.93-1.18 1.38q.03.03.05.06c.32.33.62.48.88.5.24.02.57-.05.99-.44.44-.4.94-1.09 1.47-2.23a.75.75 0 0 1 1.42.46v.02l-.01.08c-.01.07-.02.18-.04.31-.02.26-.03.59.01.9.05.32.14.56.25.7.09.11.23.21.55.21.83 0 1.35-.56 1.53-1.21a.75.75 0 0 1 1.47.15v-.01.02a1.1 1.1 0 0 0 .22.46c.19.23.65.6 1.78.6V11c-1.35 0-2.23-.41-2.77-.96.36-.4.61-.87.74-1.33l-.72-.21.75-.05-.75.05c-.75.05-.75.06-.75.06v.02a1 1 0 0 0 .02.13q.02.12.08.3a2.6 2.6 0 0 0 .63 1.03c-.51.56-1.25.96-2.23.96-.74 0-1.32-.28-1.71-.76a2.4 2.4 0 0 1-.38-.66c.44-.55.87-1.25 1.27-2.13l-.68-.31-.73-.15V7l-.01.03-.02.12a6 6 0 0 0-.05.4 5.6 5.6 0 0 0 .02 1.25c.04.25.1.52.2.78q-.27.33-.55.58c-.65.6-1.38.89-2.13.82-.73-.06-1.34-.45-1.82-.94l-.06-.06q-.17.15-.32.29a35 35 0 0 1-1.54 1.29l-.02.02-.01.01L1 11l-.46-.59h.01l.02-.02a24 24 0 0 0 .41-.32 34 34 0 0 0 1.51-1.33 7 7 0 0 1-.24-.51c-.57-1.33-.84-2.99-.52-4.28.16-.65.49-1.29 1.1-1.69m.79 5.35c.29-.32.56-.63.77-.93.56-.79.86-1.63.88-2.26.01-.31-.06-.52-.14-.66-.08-.12-.2-.23-.44-.3-.56-.15-.87-.06-1.04.05-.18.12-.36.36-.46.79-.21.87-.05 2.17.44 3.31" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
    <path d="M7.91 9.58c.44-.55.87-1.25 1.27-2.13l-.68-.31-.73-.15V7l-.01.03-.02.12a6 6 0 0 0-.05.4 5.6 5.6 0 0 0 .02 1.25c.04.25.1.52.2.78m4.32.46c.36-.4.61-.87.74-1.33l-.72-.21c-.75.05-.75.06-.75.06v.02a1 1 0 0 0 .02.13q.02.12.08.3a2.6 2.6 0 0 0 .63 1.03" fill="currentColor"/>
  </g>
`;

const SignatureAnimatedIcon: ForwardRefExoticComponent<
	AnimatedIconProps & RefAttributes<AnimatedIconRef>
> = forwardRef<AnimatedIconRef, AnimatedIconProps>(function SignatureAnimatedIcon(props, ref) {
	const [phase] = useAnimatedIconPlayback(ref, TIMELINE);
	const maskId = useSvgMaskId('signature-mask');
	const glyph = useMemo(() => getGlyph(maskId), [maskId]);

	return (
		<span
			css={[
				animatedStyles.base,
				phase === 'shade' && animatedStyles.interactionShade,
				phase === 'hold' && animatedStyles.interactionRedraw,
			]}
		>
			<Icon
				name="SignatureIcon"
				dangerouslySetGlyph={glyph}
				isAnimatedIcon
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...props}
				size="medium"
			/>
		</span>
	);
});

SignatureAnimatedIcon.displayName = 'SignatureIcon';

export default SignatureAnimatedIcon;
