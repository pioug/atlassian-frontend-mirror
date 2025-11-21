import React from 'react';
import { IntlProvider } from 'react-intl-next';
import ManagedStatusPicker from '../example-helpers/ManagedStatusPicker';

export const NeutralStatus = (): React.JSX.Element => (
	<IntlProvider locale="en">
		<ManagedStatusPicker initialSelectedColor={'neutral'} initialText={'In progress'} />
	</IntlProvider>
);

export const PurpleStatus = (): React.JSX.Element => (
	<IntlProvider locale="en">
		<ManagedStatusPicker initialSelectedColor={'purple'} initialText={'In progress'} />
	</IntlProvider>
);

export const BlueStatus = (): React.JSX.Element => (
	<IntlProvider locale="en">
		<ManagedStatusPicker initialSelectedColor={'blue'} initialText={'In progress'} />
	</IntlProvider>
);

export const RedStatus = (): React.JSX.Element => (
	<IntlProvider locale="en">
		<ManagedStatusPicker initialSelectedColor={'red'} initialText={'In progress'} />
	</IntlProvider>
);

export const YellowStatus = (): React.JSX.Element => (
	<IntlProvider locale="en">
		<ManagedStatusPicker initialSelectedColor={'yellow'} initialText={'In progress'} />
	</IntlProvider>
);

export const GreenStatus = (): React.JSX.Element => (
	<IntlProvider locale="en">
		<ManagedStatusPicker initialSelectedColor={'green'} initialText={'In progress'} />
	</IntlProvider>
);

export default (): React.JSX.Element => (
	<IntlProvider locale="en">
		<ManagedStatusPicker initialSelectedColor={'green'} initialText={'In progress'} />
	</IntlProvider>
);
