/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState, useMemo, Suspense } from 'react';

import { bind } from 'bind-event-listener';

import type { MentionAttributes } from '@atlaskit/adf-schema';
import { cssMap, jsx } from '@atlaskit/css';
import type { ProfilecardProvider } from '@atlaskit/editor-common/provider-factory';
import { Popup } from '@atlaskit/editor-common/ui';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import Portal from '@atlaskit/portal';
import type {
	ProfileCardClientData,
	TeamCentralReportingLinesData,
} from '@atlaskit/profilecard/types';
import { ProfileCardLazy } from '@atlaskit/profilecard/user';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	loadingStyles: {
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('border.radius'),
	},
});

interface ProfileCardStateProps {
	id: string | undefined;
	provider: ProfilecardProvider | undefined;
}

type WrapperProps = { children: React.ReactNode; isLoading: boolean };
const LoadingWrapper = ({ children, isLoading }: WrapperProps) =>
	isLoading ? <div css={styles.loadingStyles}>{children}</div> : children;

export const useProfileCardState = ({ id, provider }: ProfileCardStateProps) => {
	const [data, setData] = useState<ProfileCardClientData | undefined>();
	const [reportingLinesData, setReportingLinesData] = useState<
		TeamCentralReportingLinesData | undefined
	>(undefined);
	const [shouldShowGiveKudos, setShouldShowGiveKudos] = useState(false);
	const [teamCentralBaseUrl, setTeamCentralBaseUrl] = useState<string | undefined>(undefined);

	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState<boolean>(false);

	// From: packages/people-and-teams/profilecard/src/components/User/ProfileCardTrigger.tsx
	useEffect(() => {
		const fetchData = async () => {
			if (!id || !provider) {
				return;
			}
			setIsLoading(true);
			try {
				const [data, reportingLines, shouldGiveKudos, teamCentralBaseUrl] = await Promise.all([
					provider?.resourceClient.getProfile(provider?.cloudId || '', id, () => {}),
					provider?.resourceClient.getReportingLines(id),
					provider?.resourceClient.shouldShowGiveKudos(),
					provider?.resourceClient.getTeamCentralBaseUrl({
						withOrgContext: true,
						withSiteContext: true,
					}),
				]);
				setData(data);
				setReportingLinesData(reportingLines);
				setShouldShowGiveKudos(shouldGiveKudos ?? false);
				setTeamCentralBaseUrl(teamCentralBaseUrl);
				setHasError(false);
			} catch (e) {
				setHasError(true);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [id, provider]);
	return {
		data,
		reportingLinesData,
		shouldShowGiveKudos,
		teamCentralBaseUrl,
		isLoading,
		hasError,
	};
};

export function ProfileCardComponent({
	profilecardProvider,
	activeMention,
	dom,
	closeComponent,
}: {
	profilecardProvider?: Promise<ProfilecardProvider> | undefined;
	activeMention: PMNode;
	dom: HTMLElement;
	closeComponent: () => void;
}) {
	const [provider, setProvider] = useState<ProfilecardProvider | undefined>(undefined);
	useEffect(() => {
		profilecardProvider?.then((p) => {
			setProvider(p);
		});
	}, [profilecardProvider]);

	const { id, text, accessLevel } = (activeMention.attrs as MentionAttributes) ?? {};

	const actions = useMemo(
		() => provider?.getActions(id, text ?? '', accessLevel),
		[accessLevel, id, provider, text],
	);

	const { data, reportingLinesData, shouldShowGiveKudos, teamCentralBaseUrl, isLoading, hasError } =
		useProfileCardState({ id, provider });

	useEffect(() => {
		return bind(window, {
			type: 'keydown',
			listener: (e) => {
				if (e.key === 'Escape') {
					closeComponent();
				}
			},
		});
	});

	if (!provider || !activeMention) {
		return null;
	}

	const { cloudId } = provider;

	return (
		<Portal>
			<Popup target={dom} absoluteOffset={{ top: 8 }} stick>
				<Suspense fallback={null}>
					<LoadingWrapper isLoading={isLoading}>
						<ProfileCardLazy
							avatarUrl={data?.avatarUrl}
							accountType={data?.accountType}
							status={data?.status}
							statusModifiedDate={data?.statusModifiedDate}
							timestring={data?.timestring}
							isCurrentUser={data?.isCurrentUser}
							isBot={data?.isBot}
							fullName={data?.fullName}
							userId={id}
							cloudId={cloudId}
							actions={actions}
							isLoading={isLoading}
							location={data?.location}
							companyName={data?.companyName}
							customLozenges={data?.customLozenges}
							nickname={data?.nickname}
							email={data?.email}
							hasError={hasError}
							reportingLines={reportingLinesData}
							isKudosEnabled={shouldShowGiveKudos}
							teamCentralBaseUrl={teamCentralBaseUrl}
						/>
					</LoadingWrapper>
				</Suspense>
			</Popup>
		</Portal>
	);
}
