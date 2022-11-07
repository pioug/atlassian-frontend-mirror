/** @jsx jsx */
import { css, keyframes } from '@emotion/react';

export const selectorStyle = css({
  boxSizing: 'border-box',
  display: 'flex',
  padding: 0,
});

export const emojiStyle = css({
  display: 'inline-block',
  opacity: 0,
  '&.selected': {
    transition: 'transform 200ms ease-in-out  ',
    transform: 'translateY(-48px) scale(2.667)',
  },
});

export const revealAnimation = (keyframes({
  '0%': {
    opacity: 1,
    transform: 'scale(0.5)',
  },
  '75%': {
    transform: 'scale(1.25)',
  },
  '100%': {
    opacity: 1,
    transform: 'scale(1)',
  },
}) as unknown) as typeof keyframes;

export const revealStyle = css({
  animation: `${revealAnimation} 150ms ease-in-out forwards`,
});

/**
 * custom css styling for the emoji icon
 * @param index location of the emoji in the rendered list of items
 */
export const emojiStyleAnimation: (index: number) => React.CSSProperties = (
  index,
) => ({ animationDelay: `${index * 50}ms` });
