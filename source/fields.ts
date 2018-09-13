import { Endianess, Field, Struct, StructLayout } from "./struct";

type FieldOptions = {
	offset: number;
}

type VariableLengthFieldOptions = {
	length: number;
}

type OrderedFieldOptions = {
	endianess: Endianess;
}

export const Fields = {
	Int8: (options?: Int8FieldOptions): Field<number> => new Int8Field(options),
	Int16: (options?: Int16FieldOptions): Field<number> => new Int16Field(options),
	Int32: (options?: Int32FieldOptions): Field<number> => new Int32Field(options),
	Uint8: (options?: Int8FieldOptions): Field<number> => new Uint8Field(options),
	Uint16: (options?: Uint16FieldOptions): Field<number> => new Uint16Field(options),
	Uint32: (options?: Uint32FieldOptions): Field<number> => new Uint32Field(options),
	String: (options: StringFieldOptions): Field<string> => new StringField(options),
	Struct: <TStruct>(layout: StructLayout<TStruct>): Field<TStruct> => new StructField(layout),
	Array: <TStruct>(field: Field<TStruct>, bufferLength: number): Field<TStruct[]> => new ArrayField(field, bufferLength),
};

// tslint:disable:max-classes-per-file
type Uint8FieldOptions = Partial<FieldOptions>;
class Uint8Field implements Field<number> {
	public length = 1;
	public offset = 0;

	constructor(options?: Uint8FieldOptions) {
		if (typeof(options) !== "undefined") {
			if (typeof(options.offset) === "number") {
				this.offset = options.offset;
			}
		}
	}
	
	getValue = (view: DataView, offset: number) => view.getUint8(offset + this.offset);
	setValue = (view: DataView, offset: number, value: number) => view.setUint8(offset + this.offset, value);
}

type Uint16FieldOptions = Partial<FieldOptions & OrderedFieldOptions>;
class Uint16Field implements Field<number> {
	public length = 2;
	public offset = 0;
	public endianess: Endianess = Endianess.little;

	constructor(options?: Uint16FieldOptions) { 
		if (typeof(options) !== "undefined") {
			if (typeof(options.offset) === "number") {
				this.offset = options.offset;
			}

			if (typeof(options.endianess) === "number") {
				this.endianess = options.endianess;
			}
		}
	}

	public getValue = (view: DataView, offset: number) => view.getUint16(offset + this.offset, this.endianess === Endianess.little);
	public setValue = (view: DataView, offset: number, value: number) => view.setUint16(offset + this.offset, value, this.endianess === Endianess.little);
}

type Uint32FieldOptions = Partial<FieldOptions & OrderedFieldOptions>;
class Uint32Field implements Field<number> {
	public length = 4;
	public offset = 0;
	public endianess: Endianess = Endianess.little;

	constructor(options?: Uint32FieldOptions) { 
		if (typeof(options) !== "undefined") {
			if (typeof(options.offset) === "number") {
				this.offset = options.offset;
			}

			if (typeof(options.endianess) === "number") {
				this.endianess = options.endianess;
			}
		}
	}

	public getValue = (view: DataView, offset: number) => view.getUint32(offset + this.offset, this.endianess === Endianess.little);
	public setValue = (view: DataView, offset: number, value: number) => view.setUint32(offset + this.offset, value, this.endianess === Endianess.little);
}

type Int8FieldOptions = Partial<FieldOptions>;
class Int8Field implements Field<number> {
	public length = 1;
	public offset = 0;

	constructor(options?: Int8FieldOptions) { 
		if (typeof(options) !== "undefined") {
			if (typeof(options.offset) === "number") {
				this.offset = options.offset;
			}
		}
	}

	public getValue = (view: DataView, offset: number) => view.getInt8(offset + this.offset);
	public setValue = (view: DataView, offset: number, value: number) => view.setInt8(offset + this.offset, value);
}

type Int16FieldOptions = Partial<FieldOptions & OrderedFieldOptions>;
class Int16Field implements Field<number> {
	public length = 2;
	public offset = 0;
	public endianess: Endianess = Endianess.little;
	
	constructor(options?: Int16FieldOptions) { 
		if (typeof(options) !== "undefined") {
			if (typeof(options.offset) === "number") {
				this.offset = options.offset;
			}

			if (typeof(options.endianess) === "number") {
				this.endianess = options.endianess;
			}
		}
	}

	public getValue = (view: DataView, offset: number) => view.getInt16(offset + this.offset, this.endianess === Endianess.little);
	public setValue = (view: DataView, offset: number, value: number) => view.setInt16(offset + this.offset, value, this.endianess === Endianess.little);
}

type Int32FieldOptions = Partial<FieldOptions & OrderedFieldOptions>;
class Int32Field implements Field<number> {
	public length = 4;
	public offset = 0;
	public endianess: Endianess = Endianess.little;
	
	constructor(options?: Int32FieldOptions) { 
		if (typeof(options) !== "undefined") {
			if (typeof(options.offset) === "number") {
				this.offset = options.offset;
			}

			if (typeof(options.endianess) === "number") {
				this.endianess = options.endianess;
			}
		}
	}

	public getValue = (view: DataView, offset: number) => view.getInt32(offset + this.offset, this.endianess === Endianess.little);
	public setValue = (view: DataView, offset: number, value: number) => view.setInt32(offset + this.offset, value, this.endianess === Endianess.little);
}

type StringFieldOptions = Partial<FieldOptions> & VariableLengthFieldOptions;
class StringField implements Field<string> {
	public length: number;
	public offset = 0;

	constructor(options: StringFieldOptions) { 
		if (typeof(options.offset) === "number") {
			this.offset = options.offset;
		}

		this.length = options.length;
	}

	public getValue = (view: DataView, offset: number): string => {
		const bytes = [];
		for (let i = 0; i < this.length; i++) {
			const char = view.getUint8(i + offset + this.offset);
			if (char === 0) {
				break;
			}
			bytes[i] = char;
		}

		return String.fromCharCode.apply(null, bytes);
	}

	public setValue = (view: DataView, offset: number, value: string) => {
		for (let i = 0; i < this.length; i++) {
			if (i < value.length) {
				view.setInt8(i + offset + this.offset, value.charCodeAt(i));
			} else {
				view.setInt8(i + offset + this.offset, 0);
			}
		}
	}
}

class StructField<TObject extends Struct> implements Field<TObject> {
	public length: number;

	constructor(public layout: StructLayout<TObject>) {
		this.length = getStructLength(layout);
	}

	public getValue = (view: DataView, offset: number): TObject => {
		const result = {} as TObject;
		let fieldOffset = offset;
		for (const key in this.layout) {
			if (this.layout.hasOwnProperty(key)) {
				result[key] = this.layout[key].getValue(view, fieldOffset);
				fieldOffset += this.layout[key].length;
			}
		}
		return result;
	}

	public setValue = (view: DataView, offset: number, value: TObject) => {
		let fieldOffset = offset;
		for (const key in this.layout) {
			if (this.layout.hasOwnProperty(key)) {
				this.layout[key].setValue(view, fieldOffset, value[key]);
				fieldOffset += this.layout[key].length;
			}
		}
	}
}

class ArrayField<TEntry> implements Field<TEntry[]> {
	public length: number;

	constructor(public entryField: Field<TEntry>, bufferLength: number) {
		this.length = bufferLength;
	}

	public getValue = (view: DataView, offset: number): TEntry[] => {
		const count = Math.floor(this.length / this.entryField.length);
		const result = Array(count);
		for (let i = 0; i < count; i++) {
			result[i] = this.entryField.getValue(view, offset + i * this.entryField.length);
		}
		return result;
	}

	public setValue = (view: DataView, offset: number, values: TEntry[]) => {
		if (values.length !== Math.floor(this.length / this.entryField.length)) {
			throw new Error("Length of value array must match ArrayField count property");
		}

		for (let i = 0; i < values.length; i++) {
			this.entryField.setValue(view, offset + i * this.entryField.length, values[i]);
		}
	}
}

const getStructLength = (struct: StructLayout<any>) => {
	let length = 0;
	for (const key in struct) {
		if (struct.hasOwnProperty(key)) {
			length += struct[key].length;
		}
	}
	return length;
};
