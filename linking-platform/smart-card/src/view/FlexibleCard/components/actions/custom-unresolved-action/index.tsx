import React from 'react';

import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { type Prettify } from '@atlaskit/linking-common';
import { Box, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { InternalActionName, SmartLinkStatus } from '../../../../../constants';
import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context';

const styles = cssMap({
	button: {
		display: 'contents',
	},
	message: {
		paddingBlock: token('space.0'),
		paddingInline: token('space.0'),
	},
});

export type AccessType =
	| 'DIRECT_ACCESS'
	| 'REQUEST_ACCESS'
	| 'PENDING_REQUEST_EXISTS'
	| 'FORBIDDEN'
	| 'DENIED_REQUEST_EXISTS'
	| 'ACCESS_EXISTS'
	| undefined;

export type CustomStatusComponents = Partial<
	Record<NonNullable<AccessType> | 'FALLBACK', MessageDescriptor>
>;

type ErrorStatus = Extract<
	SmartLinkStatus,
	SmartLinkStatus.Forbidden | SmartLinkStatus.Unauthorized
>;

const validErrorStatuses: SmartLinkStatus[] = [
	SmartLinkStatus.Forbidden,
	SmartLinkStatus.Unauthorized,
] as const;

type CustomUnresolvedActionProps = Prettify<
	{
		Container?: React.ComponentType<{ children: React.ReactNode }>;
		onlyShowIfAction?: boolean;
		testId?: string;
	} & Partial<Record<ErrorStatus, CustomStatusComponents>>
>;

const validateErrorStatus = (status: SmartLinkStatus | undefined): status is ErrorStatus => {
	return status !== undefined && validErrorStatuses.includes(status);
};

const getMessageDescriptor = (
	status: SmartLinkStatus | undefined,
	accessType: AccessType,
	props: Exclude<CustomUnresolvedActionProps, 'testId' | 'onlyShowIfAction'>,
): MessageDescriptor | undefined => {
	if (!validateErrorStatus(status)) {
		return undefined;
	}
	const message = props?.[status]?.[accessType ?? 'FALLBACK'];
	return message;
};

const CustomUnresolvedAction = ({
	testId = 'custom-unresolved-action',
	onlyShowIfAction = false,
	Container,
	...props
}: CustomUnresolvedActionProps): JSX.Element | null => {
	const context = useFlexibleCardContext();
	const data = context?.data?.actions?.[InternalActionName.UnresolvedAction];
	if (!data) {
		return null;
	}

	const { descriptor, onClick, values } = data;
	const { status } = context;
	const accessType = context?.data?.meta?.accessType as AccessType;
	const hasAction = onClick !== undefined;

	if (onlyShowIfAction && !hasAction) {
		return null;
	}

	const messageDescriptor = getMessageDescriptor(status, accessType, props) ?? descriptor;
	if (!messageDescriptor) {
		return null;
	}

	const message = (
		<Box
			testId={`${testId}-errored-view-message`}
			tabIndex={hasAction ? 0 : undefined}
			xcss={styles.message}
		>
			<FormattedMessage {...messageDescriptor} values={values} />
		</Box>
	);

	const component = hasAction ? (
		<Pressable
			onClick={data.onClick}
			style={{ color: `inherit`, font: `inherit`, textAlign: `inherit` }}
			xcss={styles.button}
		>
			{message}
		</Pressable>
	) : (
		message
	);

	return Container ? <Container>{component}</Container> : component;
};

export default CustomUnresolvedAction;
