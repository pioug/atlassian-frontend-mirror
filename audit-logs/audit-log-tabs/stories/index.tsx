/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import type { Meta } from '@storybook/react';

// Import your component
import AuditLogTabs from '../src';

function BasicTemplateComponent() {
	// You can add any necessary logic or hooks here
	// For example, using a hook to get internationalized messages

	return <AuditLogTabs testId="audit-log-tabs" />;
}

export const Story = (): JSX.Element => {
	// Wrap your component with any necessary HOC or utility functions
	const WrappedComponent = BasicTemplateComponent; // Use any HOC like withDefaultStyles or withCommonUtilsAndData if needed

	return <WrappedComponent />;
};

// Define the meta object
const meta: Meta = {
	component: AuditLogTabs,
};

export default meta;
