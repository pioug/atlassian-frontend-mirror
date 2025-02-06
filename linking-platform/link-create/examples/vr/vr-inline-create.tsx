/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { IntlProvider } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { MockPluginForm } from '../../example-helpers/mock-plugin-form';
import type { EditViewProps, LinkCreateProps } from '../../src';
import { InlineCreate } from '../../src/ui';

const styles = cssMap({
	container: {
		width: '320px',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
});

const createExample = (props: Partial<LinkCreateProps> = {}): React.ComponentType => {
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
				<Box xcss={styles.container}>
					<InlineCreate {...props} entityKey={ENTITY_KEY} plugins={mockPlugins} />
				</Box>
			</IntlProvider>
		);
	};
};

const createExampleWithEdit = (props: Partial<LinkCreateProps> = {}): React.ComponentType => {
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
				<Box xcss={styles.container}>
					<InlineCreate
						entityKey={ENTITY_KEY}
						plugins={mockPlugins}
						onComplete={() => {
							console.log('onCompleteFunction');
						}}
						{...props}
					/>
				</Box>
			</IntlProvider>
		);
	};
};

export const DefaultInlineCreate = createExample();
export const DefaultInlineCreateWithEditButton = createExampleWithEdit({});

export default DefaultInlineCreate;
