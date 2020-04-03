import { gridSize, borderRadius } from '@atlaskit/theme/constants';

const gs = (times: number) => `${gridSize() * times}px`;
const br = (times = 1) => `${borderRadius() * times}px`;

export { gs, br };
