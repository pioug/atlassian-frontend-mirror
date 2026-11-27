export type EnrichmentEvent = Readonly<Record<string, unknown>> & {
	readonly attributes?: Readonly<Record<string, unknown>>;
};

export type EventEnrichmentOptions = Readonly<{
	appearance?: string;
	event: EnrichmentEvent;
}>;

export type EventEnricher = (
	options: EventEnrichmentOptions,
) => Record<string, unknown> | undefined;
