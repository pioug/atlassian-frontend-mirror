/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required, @atlaskit/volt-strict-mode/no-re-exports, @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated re-export shims. */
export { default } from './components';
export { default as getUserRecommendations } from './service/recommendation-client';
export { default as hydrateDefaultValues } from './service/default-value-hydration-client';
export type { RecommendationRequest, Props, State, RestrictionFilter } from './types';
export { isEmail } from '@atlaskit/user-picker/is-email';
export { isTeam } from '@atlaskit/user-picker/is-team';
export { isUser } from '@atlaskit/user-picker/is-user';
export { isExternalUser } from '@atlaskit/user-picker/is-external-user';
export { isValidEmail } from '@atlaskit/user-picker/components/email-validation';
export { isGroup } from '@atlaskit/user-picker/is-group';
export { EmailType, GroupType, TeamType, UserType } from '@atlaskit/user-picker/types';
export type {
	ActionTypes,
	Appearance,
	AtlasKitSelectChange,
	AtlaskitSelectValue,
	DefaultValue,
	InputActionTypes,
	LozengeProps,
	OnChange,
	OnInputChange,
	OnOption,
	OnPicker,
	Option,
	OptionData,
	OptionIdentifier,
	PopupUserPickerProps,
	Promisable,
	Target,
	UserPickerProps,
	UserPickerState,
	Value,
	Email,
	Group,
	GroupHighlight,
	HighlightRange,
	LoadOptions,
	Team,
	TeamHighlight,
	TeamMember,
	User,
	UserHighlight,
	ExternalUser,
	UserSource,
} from '@atlaskit/user-picker/types';
export type {
	EmailValidationResponse,
	EmailValidator,
} from '@atlaskit/user-picker/components/email-validation';
