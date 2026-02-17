import { type JQLEditorUIProps } from './jql-editor/types';

export type {
	JQLEditorUIProps,
	HydratedValue,
	HydratedValues,
	HydratedUser,
	HydratedTeam,
	HydratedProject,
} from './jql-editor/types';

export type JQLEditorProps = JQLEditorUIProps & {
	/**
	 * React-intl locale. This should be set to "en" if alternate message sets are not being loaded higher in the React
	 * tree.
	 */
	locale?: string;
};
