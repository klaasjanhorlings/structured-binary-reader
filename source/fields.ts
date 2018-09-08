import { Endianess, Field, Struct, StructLayout } from "./struct";

export const Fields = {
	Int8: () => new Int8Field(),
	Int16: (endianness = Endianess.little) => new Int16Field(endianness),
	Int32: (endianness = Endianess.little) => new Int32Field(endianness),
	Uint8: () => new Uint8Field(),
	Uint16: (endianness = Endianess.little) => new Uint16Field(endianness),
	Uint32: (endianness = Endianess.little) => new Uint32Field(endianness),
	String: (length: number) => new StringField(length),
	Struct: <TStruct>(layout: StructLayout<TStruct>) => new StructField(layout),
	Array: <TStruct>(field: Field<TStruct>, count: number) => new ArrayField(field, count),
};

// tslint:disable:max-classes-per-file
class Uint8Field implements Field<number> {
	public length = 1;
	getValue = (view: DataView, offset: number) => view.getUint8(offset);
	setValue = (view: DataView, offset: number, value: number) => view.setUint8(offset, value);
}

class Uint16Field implements Field<number> {
	public length = 2;
	constructor(public endianess = Endianess.little) { }
	public getValue = (view: DataView, offset: number) => view.getUint16(offset, this.endianess === Endianess.little);
	public setValue = (view: DataView, offset: number, value: number) => view.setUint16(offset, value, this.endianess === Endianess.little);
}

class Uint32Field implements Field<number> {
	public length = 4;
	constructor(public endianess = Endianess.little) { }
	public getValue = (view: DataView, offset: number) => view.getUint32(offset, this.endianess === Endianess.little);
	public setValue = (view: DataView, offset: number, value: number) => view.setUint32(offset, value, this.endianess === Endianess.little);
}

class Int8Field implements Field<number> {
	public length = 1;
	public getValue = (view: DataView, offset: number) => view.getInt8(offset);
	public setValue = (view: DataView, offset: number, value: number) => view.setInt8(offset, value);
}

class Int16Field implements Field<number> {
	public length = 2;
	constructor(public endianess = Endianess.little) { }
	public getValue = (view: DataView, offset: number) => view.getInt16(offset, this.endianess === Endianess.little);
	public setValue = (view: DataView, offset: number, value: number) => view.setInt16(offset, value, this.endianess === Endianess.little);
}

class Int32Field implements Field<number> {
	public length = 4;
	constructor(public endianess = Endianess.little) { }
	public getValue = (view: DataView, offset: number) => view.getInt32(offset, this.endianess === Endianess.little);
	public setValue = (view: DataView, offset: number, value: number) => view.setInt32(offset, value, this.endianess === Endianess.little);
}

class StringField implements Field<string> {
	constructor(public length: number) { }

	public getValue = (view: DataView, offset: number): string => {
		const bytes = [];
		for (let i = 0; i < this.length; i++) {
			const char = view.getUint8(i + offset);
			if (char === 0) {
				break;
			}
			bytes[i] = char;
		}

		return String.fromCharCode.apply(null, bytes);
	}

	public setValue = (view: DataView, offset: number, value: string) => {
		for (let i = 0; i < this.length; i++) {
			view.setInt8(i + offset, value.charCodeAt(i));
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

	constructor(public entryField: Field<TEntry>, public count: number) {
		this.length = entryField.length * count;
	}

	public getValue = (view: DataView, offset: number): TEntry[] => {
		const result = Array(this.count);
		for (let i = 0; i < this.count; i++) {
			result[i] = this.entryField.getValue(view, offset + i * this.entryField.length);
		}
		return result;
	}

	public setValue = (view: DataView, offset: number, values: TEntry[]) => {
		if (values.length !== this.count) {
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
