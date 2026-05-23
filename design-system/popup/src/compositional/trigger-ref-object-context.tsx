/* eslint-disable @repo/internal/react/require-jsdoc */
import { type Context, createContext, type MutableRefObject } from 'react';

/**
 * Provides the trigger element as a stable `MutableRefObject<HTMLElement | null>`
 * for the top-layer path. Unlike `TriggerRefContext` (which provides
 * `HTMLElement | null` as React state and causes a re-render when the trigger
 * mounts), this context provides a ref object whose identity is stable across
 * renders — allowing `useAnchorPosition` to receive a stable `anchorRef`
 * without needing to create a new ref wrapper on every `triggerRef` state change.
 */
export const TriggerRefObjectContext: Context<MutableRefObject<HTMLElement | null>> = createContext<
	MutableRefObject<HTMLElement | null>
>({ current: null });
