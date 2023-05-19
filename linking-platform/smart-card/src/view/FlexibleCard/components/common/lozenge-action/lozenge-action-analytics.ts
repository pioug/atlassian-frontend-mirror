import {
  TrackQuickActionFailureReason,
  TrackQuickActionType,
} from '../../../../../utils/analytics/analytics';

export const unknownLoadErrorAnalyticsPayload = {
  smartLinkActionType: TrackQuickActionType.StatusUpdate,
  reason: TrackQuickActionFailureReason.UnknownError,
  step: 'load',
};

export const permissionLoadErrorAnalyticsPayload = {
  smartLinkActionType: TrackQuickActionType.StatusUpdate,
  reason: TrackQuickActionFailureReason.PermissionError,
  step: 'load',
};

export const unknownUpdateErrorAnalyticsPayload = {
  smartLinkActionType: TrackQuickActionType.StatusUpdate,
  reason: TrackQuickActionFailureReason.UnknownError,
  step: 'update',
};

export const validationUpdateErrorAnalyticsPayload = {
  smartLinkActionType: TrackQuickActionType.StatusUpdate,
  reason: TrackQuickActionFailureReason.ValidationError,
  step: 'update',
};
