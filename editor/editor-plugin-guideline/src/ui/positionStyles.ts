/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */
import type { CSSProperties } from 'react';

import { isVerticalPosition, type Position } from '@atlaskit/editor-common/guideline';

import { VAR_POSITION_OFFSET_X, VAR_POSITION_OFFSET_Y } from './constants';

export const isNumber = (x: unknown): x is number =>
	typeof x === 'number' && !isNaN(x) && isFinite(x);

const getXPosition = (pixel: number | undefined) =>
	isNumber(pixel) ? `calc(${pixel}px + var(${VAR_POSITION_OFFSET_X}, '0px'))` : 'unset';

const getYPosition = (pixel: number | undefined) =>
	isNumber(pixel) ? `calc(${pixel}px + var(${VAR_POSITION_OFFSET_Y}, '0px'))` : 'unset';

export const getPositionStyles = (pos: Position): CSSProperties => {
	return isVerticalPosition(pos)
		? {
				left: getXPosition(pos.x),
				top: getYPosition(pos.y?.start),
				height: pos.y ? `${pos.y.end - pos.y.start}px` : '100%',
			}
		: {
				top: getYPosition(pos.y),
				left: getXPosition(pos.x?.start),
				width: pos.x ? `${pos.x.end - pos.x.start}px` : '100%',
			};
};
