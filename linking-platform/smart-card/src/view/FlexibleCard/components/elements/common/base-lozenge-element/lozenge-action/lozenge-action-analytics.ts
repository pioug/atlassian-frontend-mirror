import {
	type TrackQuickActionFailureReason,
	type TrackQuickActionType,
} from '../../../../../../../utils/analytics/analytics';

export const unknownLoadErrorAnalyticsPayload = {
	smartLinkActionType: 'StatusUpdate' as TrackQuickActionType,
	reason: 'UnknownError' as TrackQuickActionFailureReason,
	step: 'load',
};

export const permissionLoadErrorAnalyticsPayload = {
	smartLinkActionType: 'StatusUpdate' as TrackQuickActionType,
	reason: 'PermissionError' as TrackQuickActionFailureReason,
	step: 'load',
};

export const unknownUpdateErrorAnalyticsPayload = {
	smartLinkActionType: 'StatusUpdate' as TrackQuickActionType,
	reason: 'UnknownError' as TrackQuickActionFailureReason,
	step: 'update',
};

export const validationUpdateErrorAnalyticsPayload = {
	smartLinkActionType: 'StatusUpdate' as TrackQuickActionType,
	reason: 'ValidationError' as TrackQuickActionFailureReason,
	step: 'update',
};
