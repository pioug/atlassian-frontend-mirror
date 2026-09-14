import type { CardType } from '@atlaskit/linking-common/types';

export const getMarkName: any = (id: string, status: CardType) => `${status}:${id}`;
