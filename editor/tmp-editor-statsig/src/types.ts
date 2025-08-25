export type ProductKeys = {
	confluence?: string;
	jira?: string;
	test?: string;
};

export type ExperimentConfigValue = {
	param: string;
	productKeys?: ProductKeys;
	typeGuard: (value: unknown) => boolean;
} & (
	| {
			defaultValue: boolean;
	  }
	| {
			defaultValue: string;
			values: string[];
	  }
);

export type BooleanExperimentConfig = {
	defaultValue: boolean;
	param: string;
	productKeys?: ProductKeys;
};

export type MultivariateExperimentConfig<T extends string[]> = {
	defaultValue: T[number];
	param: string;
	productKeys?: ProductKeys;
	values: [...T]; // Converts string array into a tuple
};
