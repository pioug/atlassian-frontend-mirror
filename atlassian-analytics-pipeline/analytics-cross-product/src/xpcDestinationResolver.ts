const CONTROLLED_VALUE_PATTERN = /^[a-z][a-z0-9-]*$/;

declare const controlledValueBrand: unique symbol;

type ControlledValue<Kind extends string> = string & {
	readonly [controlledValueBrand]: Kind;
};

export type XpcProductId = ControlledValue<'product'>;
export type XpcSubProductId = ControlledValue<'subProduct'>;
export type XpcRouteFamily = ControlledValue<'routeFamily'>;
export type XpcMatcherId = ControlledValue<'matcher'>;

export type XpcSource = {
	product: XpcProductId;
	subProduct?: XpcSubProductId;
};

export type XpcDestinationRule = {
	host: string;
	hostMatch?: 'exact' | 'suffix';
	id: XpcMatcherId;
	pathPrefix?: string;
	precedence: number;
	product: XpcProductId;
	routeFamily?: XpcRouteFamily;
	subProduct?: XpcSubProductId;
};

export type XpcDestinationRegistry = {
	allowedHttpHosts?: readonly string[];
	atlassianHostSuffixes: readonly string[];
	rules: readonly XpcDestinationRule[];
	taxonomyVersion: number;
};

type KnownDestination = {
	classificationMethod: 'sharedUrlClassifier';
	confidence: 'exact';
	destinationProduct: XpcProductId;
	destinationSubProduct?: XpcSubProductId;
	matcherId: XpcMatcherId;
	routeFamily?: XpcRouteFamily;
	taxonomyVersion: number;
};

export type XpcDestinationResolution =
	| (KnownDestination &
			(
				| {
						outcome: 'same';
						reason: 'sameKnownProduct';
				  }
				| {
						outcome: 'cross';
						reason: 'differentKnownProduct';
				  }
			))
	| {
			classificationMethod: 'sharedUrlClassifier';
			confidence: 'none';
			outcome: 'unknown';
			reason: 'recognizedHostUnknownRoute' | 'ambiguousSharedHost';
			taxonomyVersion: number;
	  }
	| {
			classificationMethod: 'sharedUrlClassifier';
			confidence: 'none';
			outcome: 'excluded';
			reason: 'invalidUrl' | 'unsupportedScheme' | 'thirdParty';
			taxonomyVersion: number;
	  };

export type XpcDestinationResolverInput = {
	baseUrl: string;
	registry: XpcDestinationRegistry;
	source: XpcSource;
	url: string;
};

const createControlledValue = <Kind extends string>(
	value: string,
	kind: Kind,
): ControlledValue<Kind> => {
	if (!CONTROLLED_VALUE_PATTERN.test(value)) {
		throw new Error(`Invalid controlled XPC ${kind} value`);
	}

	return value as ControlledValue<Kind>;
};

const createXpcProductId = (value: string): XpcProductId => createControlledValue(value, 'product');

const createXpcSubProductId = (value: string): XpcSubProductId =>
	createControlledValue(value, 'subProduct');

const createXpcRouteFamily = (value: string): XpcRouteFamily =>
	createControlledValue(value, 'routeFamily');

const createXpcMatcherId = (value: string): XpcMatcherId => createControlledValue(value, 'matcher');

const normalizeHost = (host: string): string => host.toLowerCase().replace(/\.$/, '');

const matchesHost = (candidate: string, rule: XpcDestinationRule): boolean => {
	const ruleHost = normalizeHost(rule.host);

	if (rule.hostMatch !== 'suffix') {
		return candidate === ruleHost;
	}

	return candidate === ruleHost || candidate.endsWith(`.${ruleHost}`);
};

const matchesPath = (pathname: string, pathPrefix?: string): boolean => {
	if (!pathPrefix) {
		return true;
	}

	return pathname === pathPrefix || pathname.startsWith(`${pathPrefix}/`);
};

const matchesSuffix = (host: string, suffix: string): boolean => {
	const normalizedSuffix = normalizeHost(suffix);
	return host === normalizedSuffix || host.endsWith(`.${normalizedSuffix}`);
};

const excluded = (
	registry: XpcDestinationRegistry,
	reason: Extract<XpcDestinationResolution, { outcome: 'excluded' }>['reason'],
): XpcDestinationResolution => ({
	outcome: 'excluded',
	classificationMethod: 'sharedUrlClassifier',
	confidence: 'none',
	reason,
	taxonomyVersion: registry.taxonomyVersion,
});

const resolveXpcDestination = ({
	baseUrl,
	registry,
	source,
	url,
}: XpcDestinationResolverInput): XpcDestinationResolution => {
	let parsedUrl: URL;

	try {
		parsedUrl = new URL(url, baseUrl);
	} catch {
		return excluded(registry, 'invalidUrl');
	}

	const host = normalizeHost(parsedUrl.hostname);
	const allowedHttpHosts = registry.allowedHttpHosts?.map(normalizeHost) ?? [];
	const isAllowedProtocol =
		parsedUrl.protocol === 'https:' ||
		(parsedUrl.protocol === 'http:' && allowedHttpHosts.includes(host));

	if (!isAllowedProtocol) {
		return excluded(registry, 'unsupportedScheme');
	}

	const matchingRules = registry.rules
		.filter((rule) => matchesHost(host, rule) && matchesPath(parsedUrl.pathname, rule.pathPrefix))
		.sort((left, right) => right.precedence - left.precedence);
	const highestPrecedence = matchingRules[0]?.precedence;
	const strongestMatches = matchingRules.filter((rule) => rule.precedence === highestPrecedence);

	if (strongestMatches.length > 1) {
		const identities = new Set(
			strongestMatches.map(
				(rule) => `${rule.product}:${rule.subProduct ?? ''}:${rule.routeFamily ?? ''}`,
			),
		);
		if (identities.size > 1) {
			return {
				outcome: 'unknown',
				classificationMethod: 'sharedUrlClassifier',
				confidence: 'none',
				reason: 'ambiguousSharedHost',
				taxonomyVersion: registry.taxonomyVersion,
			};
		}
	}

	const match = strongestMatches[0];
	if (match) {
		const isSameProduct = match.product === source.product;
		const knownDestination = {
			destinationProduct: match.product,
			...(match.subProduct ? { destinationSubProduct: match.subProduct } : {}),
			...(match.routeFamily ? { routeFamily: match.routeFamily } : {}),
			classificationMethod: 'sharedUrlClassifier',
			confidence: 'exact',
			matcherId: match.id,
			taxonomyVersion: registry.taxonomyVersion,
		} as const;

		if (isSameProduct) {
			return {
				...knownDestination,
				outcome: 'same',
				reason: 'sameKnownProduct',
			};
		}

		return {
			...knownDestination,
			outcome: 'cross',
			reason: 'differentKnownProduct',
		};
	}

	if (registry.atlassianHostSuffixes.some((suffix) => matchesSuffix(host, suffix))) {
		return {
			outcome: 'unknown',
			classificationMethod: 'sharedUrlClassifier',
			confidence: 'none',
			reason: 'recognizedHostUnknownRoute',
			taxonomyVersion: registry.taxonomyVersion,
		};
	}

	return excluded(registry, 'thirdParty');
};

export class XpcDestinationResolver {
	static createMatcherId: (value: string) => XpcMatcherId = createXpcMatcherId;
	static createProductId: (value: string) => XpcProductId = createXpcProductId;
	static createRouteFamily: (value: string) => XpcRouteFamily = createXpcRouteFamily;
	static createSubProductId: (value: string) => XpcSubProductId = createXpcSubProductId;
	static resolve: (input: XpcDestinationResolverInput) => XpcDestinationResolution =
		resolveXpcDestination;
}
