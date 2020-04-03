import { GasPayload } from '@atlaskit/analytics-gas-types';
import { Identifier, isFileIdentifier } from '@atlaskit/media-client';
import { packageAttributes, PackageAttributes } from './index';
import { NavigationDirection, NavigationSource } from '../navigation';

function actionFromDirection(direction: NavigationDirection): string {
  switch (direction) {
    case 'next':
      return 'next';
    case 'prev':
      return 'previous';
  }
}

function inputFromSource(source: NavigationSource): string {
  switch (source) {
    case 'mouse':
      return 'button';
    case 'keyboard':
      return 'keys';
  }
}

const fileDetailsFromIdentifier = (identifier: Identifier) => ({
  fileId:
    isFileIdentifier(identifier) && typeof identifier.id === 'string'
      ? identifier.id
      : '',
});

export interface NavigationAttributes {
  fileId: string;
  input: string;
}

export interface NavigationGasPayload extends GasPayload {
  attributes: NavigationAttributes & PackageAttributes;
}

export function createNavigationEvent(
  direction: NavigationDirection,
  source: NavigationSource,
  newItem: Identifier,
): NavigationGasPayload {
  return {
    eventType: 'ui',
    action: 'navigated',
    actionSubject: 'file',
    actionSubjectId: actionFromDirection(direction),
    attributes: {
      ...packageAttributes,
      ...fileDetailsFromIdentifier(newItem),
      input: inputFromSource(source),
    },
  };
}
