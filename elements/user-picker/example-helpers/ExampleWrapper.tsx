import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { assignToMe, exampleOptions, filterUsers, unassigned, withLocalResource } from '.';
import {
	type LoadOptions,
	type OnOption,
	type OptionData,
	type UserPickerProps,
} from '../src/types';


const mockOptions = withLocalResource(exampleOptions);

type ChildrenProps = {
	loadUsers: LoadOptions;
	options: OptionData[];
} & Pick<UserPickerProps, 'onInputChange' | 'onSelection'>;

export type Props = {
	children: (props: ChildrenProps) => React.ReactNode;
};

export class ExampleWrapper extends React.PureComponent<Props, { options: OptionData[] }> {
	constructor(props: Props) {
		super(props);
		this.state = {
			options: mockOptions,
		};
	}

	private loadUsers = (searchText?: string, sessionId?: string) => {
		if (searchText && searchText.length > 0) {
			return new Promise<OptionData[]>((resolve) => {
				window.setTimeout(() => resolve(filterUsers(searchText)), 1000);
			});
		}

		if (sessionId) {
			console.log(`sessionId is ${sessionId}`);
		}

		return [
			unassigned,
			assignToMe,
			new Promise<OptionData[]>((resolve) => {
				window.setTimeout(() => resolve(mockOptions), 1000);
			}),
		];
	};

	private onInputChange = (searchText?: string) => {
		this.setState({
			options: searchText && searchText.length > 0 ? filterUsers(searchText) : mockOptions,
		});
	};

	private onSelection = (
		selection: Parameters<OnOption>[0],
		sessionId: Parameters<OnOption>[1],
	) => {
		console.log('@atlaskit/user-picker onSelection:', selection, sessionId);
	};

	render() {
		const { children } = this.props;
		const { options } = this.state;

		const example = children({
			options,
			loadUsers: this.loadUsers,
			onInputChange: this.onInputChange,
			onSelection: this.onSelection,
		});
		return (
			<IntlProvider locale="en">
				<div>{example}</div>
			</IntlProvider>
		);
	}
}
