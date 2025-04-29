export type ProductKeys = {
	confluence?: string;
	jira?: string;
	test?: string;
};

export type ExperimentConfigValue = {
	productKeys?: ProductKeys;
	param: string;
	typeGuard: (value: unknown) => boolean;
	defaultValue: boolean | string;
};

export type BooleanExperimentConfig = {
	productKeys?: ProductKeys;
	param: string;
	defaultValue: boolean;
};

export type MultivariateExperimentConfig<T extends string[]> = {
	productKeys?: ProductKeys;
	param: string;
	values: [...T]; // Turns string[] into a tuple
	defaultValue: T[number];
};
