import type { RefObject } from 'react';

export const EDIT_AREA_ID = 'ak-editor-textarea';

export type UseStickyToolbarType = boolean | RefObject<HTMLElement> | { offsetTop: number };
