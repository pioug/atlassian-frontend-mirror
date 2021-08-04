export { isValidEmail } from './components/emailValidation';
export type {
  EmailValidationResponse,
  EmailValidator,
} from './components/emailValidation';
export { UserPicker as default } from './components/UserPicker';
export {
  getUserRecommendations,
  hydrateDefaultValues,
  SmartUserPicker,
  setSmartUserPickerEnv,
} from './components/smart-user-picker/index';
export type {
  RecommendationRequest,
  SmartUserPickerProps,
  SupportedProduct,
} from './components/smart-user-picker/index';
export { PopupUserPicker } from './components/PopupUserPicker';
export { isEmail, isTeam, isUser } from './components/utils';
export {
  // Constants
  EmailType,
  GroupType,
  TeamType,
  UserType,
} from './types';
export type {
  // Types
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
  // Interfaces
  Email,
  Group,
  GroupHighlight,
  HighlightRange,
  LoadOptions,
  Team,
  TeamHighlight,
  User,
  UserHighlight,
  ExternalUser,
  UserSource,
} from './types';
