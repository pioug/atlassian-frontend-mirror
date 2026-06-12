/** Fixed document thresholds for limited (performance) mode (previously Statsig-driven). */
export const LIMITED_MODE_DEFAULT_NODE_COUNT_THRESHOLD = 5000;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const LIMITED_MODE_DEFAULT_DOC_SIZE_THRESHOLD = 30000;

/** When true, any legacy-content macro triggers limited mode regardless of size/count. */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const LIMITED_MODE_INCLUDE_LEGACY_CONTENT_IN_THRESHOLD = true;
