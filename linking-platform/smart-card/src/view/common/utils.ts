import facepaint from 'facepaint';

// this function is used for spacing, fontsize and line height,
// once design tokens have been established for the all of these categories
// then this function can be replaced with the tokens
const gs = (times: number) => `${8 * times}px`;
const br = (times = 1) => `${3 * times}px`;
const mq = facepaint(['@media(min-width: 576px)']);

export { gs, br, mq };
