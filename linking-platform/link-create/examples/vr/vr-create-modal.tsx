import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { default as whiteboardSvg } from '../../example-helpers/hero-image.svg';
import { MockPluginForm } from '../../example-helpers/mock-plugin-form';
import LinkCreate, { type EditViewProps, type LinkCreateWithModalProps } from '../../src';

const createExample = (props: Partial<LinkCreateWithModalProps> = {}): React.ComponentType => {
	return function Example() {
		const ENTITY_KEY = 'object-name';

		const mockPlugins = [
			{
				group: {
					label: 'test',
					icon: 'test-icon',
					key: 'mock-plugin',
				},
				label: 'label',
				icon: 'icon',
				key: ENTITY_KEY,
				form: <MockPluginForm />,
			},
		];

		return (
			<IntlProvider locale="en">
				<LinkCreate {...props} active={true} entityKey={ENTITY_KEY} plugins={mockPlugins} />
			</IntlProvider>
		);
	};
};

const createExampleWithEdit = (
	props: Partial<LinkCreateWithModalProps> = {},
): React.ComponentType => {
	return function EditExample() {
		const ENTITY_KEY = 'object-name';

		const mockPlugins = [
			{
				group: {
					label: 'test',
					icon: 'test-icon',
					key: 'mock-plugin',
				},
				label: 'label',
				icon: 'icon',
				key: ENTITY_KEY,
				form: <MockPluginForm />,
				editView: ({ payload, onClose }: EditViewProps) => {
					return <h1>this is an edit view</h1>;
				},
			},
		];

		return (
			<IntlProvider locale="en">
				<LinkCreate
					active={true}
					entityKey={ENTITY_KEY}
					plugins={mockPlugins}
					onComplete={() => {
						console.log('onCompleteFunction');
					}}
					{...props}
				/>
			</IntlProvider>
		);
	};
};

export const DefaultCreateWithModal = createExample();
export const DefaultCreateWithModalTitle = createExample({
	modalTitle: 'Create custom title',
});

export const DefaultCreateWithModalHero = createExample({
	modalHero: <img src={whiteboardSvg} alt="Whiteboard" />,
});
export const DefaultCreateWithEditButton = createExampleWithEdit({});

export default DefaultCreateWithModal;
