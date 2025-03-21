type BlockAttachment = {
	type: 'image';
	url: string;
};
type DefaultAttributes = {
	label?: string;
	description?: string;
	required?: boolean;
	attachment?: BlockAttachment;
	theme?: number;
};
export interface BlockAttributes extends DefaultAttributes {
	[ x: string ]: unknown;
}

export type FormBlock = {
	id: string;
	name: string;
	attributes?: BlockAttributes;
};

export type FormBlocks = FormBlock[];
