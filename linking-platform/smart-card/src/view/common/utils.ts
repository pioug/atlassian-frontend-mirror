import facepaint from 'facepaint';

const gs = (times: number) => `${8 * times}px`;
const br = (times = 1) => `${3 * times}px`;
const mq = facepaint(['@media(min-width: 576px)']);

export { gs, br, mq };
