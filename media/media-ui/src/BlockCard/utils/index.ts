import { gridSize, borderRadius } from '@atlaskit/theme/constants';
import facepaint from 'facepaint';

const gs = (times: number) => `${gridSize() * times}px`;
const br = (times = 1) => `${borderRadius() * times}px`;
const mq = facepaint(['@media(min-width: 576px)']);

export { gs, br, mq };
