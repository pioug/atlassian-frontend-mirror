import type { CardType } from '@atlaskit/linking-common/types';

export const getMeasureName: any = (id: string, status: CardType) => `time-to-${status}:${id}`;
