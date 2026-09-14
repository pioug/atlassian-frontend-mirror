import React from 'react';

import { smartUserPickerRenderedUfoExperience } from './ufoExperiences';

export class UfoErrorBoundary extends React.Component<React.PropsWithChildren<{ id: string }>> {
	componentDidCatch(): void {
		smartUserPickerRenderedUfoExperience.getInstance(this.props.id).failure();
	}

	render(): React.ReactNode {
		return this.props.children;
	}
}
