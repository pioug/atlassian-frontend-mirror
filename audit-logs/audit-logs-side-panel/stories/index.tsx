/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import type { Meta } from '@storybook/react';

// Import your component
import AuditLogsSidePanel from '../src';

function BasicTemplateComponent() {
	// You can add any necessary logic or hooks here
	// For example, using a hook to get internationalized messages

	return <AuditLogsSidePanel testId="audit-logs-side-panel" isSelected={false} />;
}

export const Story = () => {
	// Wrap your component with any necessary HOC or utility functions
	const WrappedComponent = BasicTemplateComponent; // Use any HOC like withDefaultStyles or withCommonUtilsAndData if needed

	return <WrappedComponent />;
};

// Define the meta object
const meta: Meta = {
	component: AuditLogsSidePanel,
};

export default meta;
