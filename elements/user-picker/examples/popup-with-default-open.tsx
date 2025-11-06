import Button from '@atlaskit/button/new';
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import { PopupUserPicker } from '../src';

const Example = () => {
	return (
		<IntlProvider locale="en">
			<ExampleWrapper>
				{({ options, onInputChange, onSelection }) => (
					<PopupUserPicker
						popupTitle="Assignee"
						fieldId="example"
						target={({ ref }) => {
							return <Button ref={ref}>Target</Button>;
						}}	
						width={200}
						placement="right"
						shouldFlip={true}
						offset={[0, 0]}
						boundariesElement="window"
						options={options}
						onInputChange={onInputChange}
						onSelection={onSelection}
						popupSelectProps={{ defaultIsOpen: true }}
					/>
				)}
			</ExampleWrapper>
		</IntlProvider>
	);
};
export default Example;
