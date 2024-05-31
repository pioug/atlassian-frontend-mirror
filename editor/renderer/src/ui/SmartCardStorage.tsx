import React from 'react';
import type { Diff } from '@atlaskit/editor-common/utils';

export interface WithSmartCardStorageProps {
	smartCardStorage: Map<string, string>;
}

export const Context = React.createContext<Map<string, string>>(new Map());

export const Provider = function ({ children }: React.PropsWithChildren<unknown>) {
	return <Context.Provider value={new Map()}>{children}</Context.Provider>;
};

export const withSmartCardStorage = <Props extends WithSmartCardStorageProps>(
	WrappedComponent: React.ComponentType<React.PropsWithChildren<Props>>,
) => {
	return class extends React.Component<Diff<Props, WithSmartCardStorageProps>> {
		render() {
			return (
				<Context.Consumer>
					{(storage) => <WrappedComponent {...(this.props as Props)} smartCardStorage={storage} />}
				</Context.Consumer>
			);
		}
	};
};
