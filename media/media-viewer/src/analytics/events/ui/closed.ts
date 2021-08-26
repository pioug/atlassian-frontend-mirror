import { UIEventPayload } from '@atlaskit/media-common';
import { end } from 'perf-marks';

export type ClosedInputType = 'button' | 'blanket' | 'escKey';

export interface ClosedAttributes {
  input: ClosedInputType;
  sessionDurationMs: number;
}

export type ClosedEventPayload = UIEventPayload<
  ClosedAttributes,
  'closed',
  'mediaViewer'
>;

export const createClosedEvent = (
  input: ClosedInputType,
): ClosedEventPayload => ({
  eventType: 'ui',
  action: 'closed',
  actionSubject: 'mediaViewer',
  attributes: {
    sessionDurationMs: end('MediaViewer.SessionDuration').duration || 0,
    input,
  },
});
