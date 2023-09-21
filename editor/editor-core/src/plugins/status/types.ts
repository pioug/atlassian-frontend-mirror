import type { Color as ColorType } from '@atlaskit/status/element';
import type { closingMethods } from './ui/statusPicker';

export type StatusType = {
  color: ColorType;
  text: string;
  localId?: string;
};

export type StatusState = {
  isNew: boolean;
  showStatusPickerAt: number | null;
};

export interface StatusPluginOptions {
  menuDisabled: boolean;
  allowZeroWidthSpaceAfter?: boolean;
}

export type ClosingPayload = {
  closingMethod: closingMethods;
};
