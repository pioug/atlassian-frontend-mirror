// This is a list of field types expected as collapsed fields, e.g. of the form
// name[fieldtype]. The square brackets are retained to allow us to more easily
// differentiate these from regular fields.

// Currently these are being used in `jql-insights-listener.ts` to allow us to
// collect data about the usage of some custom field types.

// All field type names here must be in lower case
export const TEAM_CUSTOM_FIELD_TYPE = '[team]';

// This is the regular expression pattern that can be used to extract the
// custom field type from the field name.
export const COLLAPSED_CUSTOM_FIELD_PATTERN = /^['"].+\[(\D+)]['"]$/i;
export const COLLAPSED_CUSTOM_FIELD_PATTERN_NO_QUOTES = /^.+\[(\D+)]$/i;
