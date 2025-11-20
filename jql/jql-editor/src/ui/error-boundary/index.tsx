import React, {
	Component,
	type ComponentClass,
	type FunctionComponent,
	type ReactNode,
} from 'react';

// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { JQLEditorReadOnly } from '../jql-editor-layout';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { type JQLEditorUIProps } from '../jql-editor/types';

type ErrorBoundaryProps = {
	/**
	 * Children to render.
	 */
	children: ReactNode;
	/**
	 * Called if an error is caught while rendering children.
	 */
	onError?: (error: Error) => void;
	/**
	 * Fallback node to render when an error occurs.
	 */
	render: (props: { error: Error }) => ReactNode;
};
type State = {
	error: Error | null;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
	state: State = {
		error: null,
	};

	componentDidCatch(error: Error) {
		this.setState({
			error,
		});

		this.props.onError && this.props.onError(error);
	}

	render() {
		const { children, render: renderFallback } = this.props;
		const { error } = this.state;

		if (error === null) {
			return children;
		}

		return renderFallback({ error });
	}
}

type WithErrorBoundaryProps = {
	/**
	 * To adjust size of the editor
	 * `false` matches AK's default field styling
	 * `true` matches AK's compact field styling, used for search purposes
	 */
	isCompact?: boolean;
	/**
	 * Called if an unexpected error is thrown while rendering the editor.
	 */
	onRenderError?: (error: Error) => void;
	/**
	 * Called every time the search command is given in the editor with the current query value and respective Jast object.
	 * If not passed, hides the search button/other search related functionality, allowing this to be usable as a form field.
	 */
	onSearch?: JQLEditorUIProps['onSearch'];
	/**
	 * The query to render in the editor.
	 */
	query: string;
};

export const withErrorBoundary = <Props extends WithErrorBoundaryProps>(
	WrappedComponent: FunctionComponent<Props> | ComponentClass<Props>,
) => {
	return (props: Props): React.JSX.Element => {
		const { query, onRenderError, onSearch, isCompact } = props;

		return (
			<ErrorBoundary
				onError={onRenderError}
				render={() => (
					<JQLEditorReadOnly query={query} isSearch={!!onSearch} isCompact={isCompact} />
				)}
			>
				<WrappedComponent {...props} />
			</ErrorBoundary>
		);
	};
};
