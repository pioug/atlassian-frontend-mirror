export type ProductKeys = {
	confluence?: string;
	jira?: string;
	test?: string;
};

export type ExperimentConfigValue = {
	productKeys?: ProductKeys;
	param: string;
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
	productKeys?: ProductKeys;
	param: string;
	defaultValue: boolean;
};

export type MultivariateExperimentConfig<T extends string[]> = {
	productKeys?: ProductKeys;
	param: string;
	values: [...T]; // Converts string array into a tuple
	defaultValue: T[number];
};
