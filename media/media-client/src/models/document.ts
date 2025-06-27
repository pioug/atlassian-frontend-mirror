export type Font = {
	name: string;
	size: number;
	weight: number;
	is_all_caps: boolean;
	is_bold_reenforced: boolean;
	is_cursive: boolean;
	is_fixed_pitch: boolean;
	is_italic: boolean;
	is_non_symbolic: boolean;
	is_proportional_pitch: boolean;
	is_sans_serif: boolean;
	is_serif: boolean;
	is_small_caps: boolean;
	is_symbolic: boolean;
};

export type Span = {
	text: string;
	fi: number;
	r: number;
	x: number;
	y: number;
	h: number;
	l: number;
};

export type Line = {
	r: number;
	spans: readonly Span[];
};

export type DocumentAnnotations = {
	text_form_fields: readonly TextField[];
	combobox_form_fields: readonly ComboBoxField[];
};

export type TextField = {
	x: number;
	y: number;
	w: number;
	h: number;
	f: number;
	text: string;
};

export type ComboBoxField = {
	x: number;
	y: number;
	w: number;
	h: number;
	f: number;
	text: string;
};

export type DocumentLink =
	| {
			type: 'uri';
			dest: string;
			x: number;
			y: number;
			w: number;
			h: number;
	  }
	| {
			type: 'local';
			p_num: number;
			x: number;
			y: number;
			w: number;
			h: number;
	  };
export type DocumentPageContent = {
	rotation: number;
	width: number;
	height: number;
	lines: readonly Line[];
	annotations: DocumentAnnotations;
	links: readonly DocumentLink[];
	password?: string;
};

export type DocumentPageRangeContent = {
	total_pages: number;
	start_index: number;
	end_index: number;
	fonts: readonly Font[];
	pages: readonly DocumentPageContent[];
};

export type GetDocumentContentOptions = {
	pageStart: number;
	pageEnd: number;
	collectionName?: string;
	maxAge?: number;
	password?: string;
};

export type GetDocumentPageImage = {
	page: number;
	zoom: number;
	collectionName?: string;
	maxAge?: number;
	password?: string;
};
