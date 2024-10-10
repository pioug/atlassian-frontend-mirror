import React, { PureComponent, useLayoutEffect, useRef, useState } from 'react';

import { ResourcedMention } from '@atlaskit/mention/element';
import type { MentionProvider } from '@atlaskit/mention/resource';

import type { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import type { MentionEventHandlers } from '../EventHandlers';

import ResourcedMentionWithProfilecard from './mention-with-profilecard';

export interface Props {
	id: string;
	text: string;
	accessLevel?: string;
	mentionProvider?: Promise<MentionProvider>;
	profilecardProvider?: Promise<ProfilecardProvider>;
	eventHandlers?: MentionEventHandlers;
	localId?: string;
}

export interface State {
	profilecardProvider: ProfilecardProvider | null;
}

const GENERIC_USER_IDS = ['HipChat', 'all', 'here'];
const noop = () => {};

export const MentionWithProviders = ({
	accessLevel,
	eventHandlers,
	id,
	mentionProvider,
	profilecardProvider: profilecardProviderResolver,
	text,
	localId,
}: Props) => {
	const [profilecardProvider, setProfilecardProvider] = useState<ProfilecardProvider | null>(null);
	const mountedRef = useRef(true);

	useLayoutEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	useLayoutEffect(() => {
		// We are not using async/await here to avoid having an intermediate Promise
		// introduced by the transpiler.
		// This will allow consumer to use a SynchronousPromise.resolve and avoid useless
		// rerendering
		profilecardProviderResolver
			?.then((result) => {
				if (mountedRef.current) {
					setProfilecardProvider(result);
				}
			})
			.catch(() => {
				if (mountedRef.current) {
					setProfilecardProvider(null);
				}
			});
	}, [profilecardProviderResolver]);

	const MentionComponent =
		profilecardProviderResolver && GENERIC_USER_IDS.indexOf(id) === -1
			? ResourcedMentionWithProfilecard
			: ResourcedMention;

	return (
		<MentionComponent
			id={id}
			text={text}
			accessLevel={accessLevel}
			localId={localId}
			mentionProvider={mentionProvider}
			profilecardProvider={profilecardProvider!}
			onClick={eventHandlers?.onClick}
			onMouseEnter={eventHandlers?.onMouseEnter}
			onMouseLeave={eventHandlers?.onMouseLeave}
		/>
	);
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class MentionWithProvidersOld extends PureComponent<Props, State> {
	state: State = { profilecardProvider: null };

	UNSAFE_componentWillMount() {
		this.updateProfilecardProvider(this.props);
	}

	UNSAFE_componentWillReceiveProps(nextProps: Props) {
		if (nextProps.profilecardProvider !== this.props.profilecardProvider) {
			this.updateProfilecardProvider(nextProps);
		}
	}

	private updateProfilecardProvider(props: Props) {
		// We are not using async/await here to avoid having an intermediate Promise
		// introduced by the transpiler.
		// This will allow consumer to use a SynchronousPromise.resolve and avoid useless
		// rerendering
		if (props.profilecardProvider) {
			props.profilecardProvider
				.then((profilecardProvider) => {
					this.setState({ profilecardProvider });
				})
				.catch(() => {
					this.setState({ profilecardProvider: null });
				});
		} else {
			this.setState({ profilecardProvider: null });
		}
	}

	render() {
		const { accessLevel, eventHandlers, id, mentionProvider, text, localId } = this.props;

		const { profilecardProvider } = this.state;

		const actionHandlers: MentionEventHandlers = {} as any;
		(['onClick', 'onMouseEnter', 'onMouseLeave'] as Array<keyof MentionEventHandlers>).forEach(
			(handler) => {
				actionHandlers[handler] = (eventHandlers && eventHandlers[handler]) || noop;
			},
		);

		const MentionComponent =
			profilecardProvider && GENERIC_USER_IDS.indexOf(id) === -1
				? ResourcedMentionWithProfilecard
				: ResourcedMention;

		return (
			<MentionComponent
				id={id}
				text={text}
				accessLevel={accessLevel}
				localId={localId}
				mentionProvider={mentionProvider}
				profilecardProvider={profilecardProvider!}
				{...actionHandlers}
			/>
		);
	}
}
