import React from 'react';

import { smartUserPickerRenderedUfoExperience } from './ufoExperiences';

type Props = React.PropsWithChildren<{ id: string }>;

type State = {
	hasError: boolean;
	previousProps: Props;
};

export class UfoErrorBoundary extends React.Component<Props, State> {
	state: State = { hasError: false, previousProps: this.props };

	static getDerivedStateFromProps(props: Props, state: State): State | null {
		// Preserve the original boundary's retry on parent updates, even when children are memoized.
		// Error recovery uses the same props, so it must retain the fallback instead of retrying.
		return props !== state.previousProps ? { hasError: false, previousProps: props } : null;
	}

	static getDerivedStateFromError(): Partial<State> {
		return { hasError: true };
	}

	componentDidCatch(): void {
		smartUserPickerRenderedUfoExperience.getInstance(this.props.id).failure();
	}

	render(): React.ReactNode {
		return this.state.hasError ? null : this.props.children;
	}
}
