/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import type { Meta } from '@storybook/react';

// Import your component
import AuditLogEventsQueryController from '../src';

function BasicTemplateComponent(): JSX.Element {
	// You can add any necessary logic or hooks here
	// For example, using a hook to get internationalized messages

	return <AuditLogEventsQueryController testId="audit-log-events-query-controller" />;
}

export const Story = (): JSX.Element => {
	// Wrap your component with any necessary HOC or utility functions
	const WrappedComponent = BasicTemplateComponent; // Use any HOC like withDefaultStyles or withCommonUtilsAndData if needed

	return <WrappedComponent />;
};

// Define the meta object
const meta: Meta = {
	component: AuditLogEventsQueryController,
};

export default meta;
