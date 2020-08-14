"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fields = void 0;
const struct_1 = require("./struct");
exports.Fields = {
    Int8: () => new Int8Field(),
    Int16: (endianness = struct_1.Endianess.little) => new Int16Field(endianness),
    Int32: (endianness = struct_1.Endianess.little) => new Int32Field(endianness),
    Uint8: () => new Uint8Field(),
    Uint16: (endianness = struct_1.Endianess.little) => new Uint16Field(endianness),
    Uint32: (endianness = struct_1.Endianess.little) => new Uint32Field(endianness),
    String: (length) => new StringField(length),
    Struct: (layout) => new StructField(layout),
    Array: (field, bufferLength) => new ArrayField(field, bufferLength),
};
// tslint:disable:max-classes-per-file
class Uint8Field {
    constructor() {
        this.length = 1;
        this.getValue = (view, offset) => view.getUint8(offset);
        this.setValue = (view, offset, value) => view.setUint8(offset, value);
    }
}
class Uint16Field {
    constructor(endianess = struct_1.Endianess.little) {
        this.endianess = endianess;
        this.length = 2;
        this.getValue = (view, offset) => view.getUint16(offset, this.endianess === struct_1.Endianess.little);
        this.setValue = (view, offset, value) => view.setUint16(offset, value, this.endianess === struct_1.Endianess.little);
    }
}
class Uint32Field {
    constructor(endianess = struct_1.Endianess.little) {
        this.endianess = endianess;
        this.length = 4;
        this.getValue = (view, offset) => view.getUint32(offset, this.endianess === struct_1.Endianess.little);
        this.setValue = (view, offset, value) => view.setUint32(offset, value, this.endianess === struct_1.Endianess.little);
    }
}
class Int8Field {
    constructor() {
        this.length = 1;
        this.getValue = (view, offset) => view.getInt8(offset);
        this.setValue = (view, offset, value) => view.setInt8(offset, value);
    }
}
class Int16Field {
    constructor(endianess = struct_1.Endianess.little) {
        this.endianess = endianess;
        this.length = 2;
        this.getValue = (view, offset) => view.getInt16(offset, this.endianess === struct_1.Endianess.little);
        this.setValue = (view, offset, value) => view.setInt16(offset, value, this.endianess === struct_1.Endianess.little);
    }
}
class Int32Field {
    constructor(endianess = struct_1.Endianess.little) {
        this.endianess = endianess;
        this.length = 4;
        this.getValue = (view, offset) => view.getInt32(offset, this.endianess === struct_1.Endianess.little);
        this.setValue = (view, offset, value) => view.setInt32(offset, value, this.endianess === struct_1.Endianess.little);
    }
}
class StringField {
    constructor(length) {
        this.length = length;
        this.getValue = (view, offset) => {
            const bytes = [];
            for (let i = 0; i < this.length; i++) {
                const char = view.getUint8(i + offset);
                if (char === 0) {
                    break;
                }
                bytes[i] = char;
            }
            return String.fromCharCode.apply(null, bytes);
        };
        this.setValue = (view, offset, value) => {
            for (let i = 0; i < this.length; i++) {
                view.setInt8(i + offset, value.charCodeAt(i));
            }
        };
    }
}
class StructField {
    constructor(layout) {
        this.layout = layout;
        this.getValue = (view, offset) => {
            const result = {};
            let fieldOffset = offset;
            for (const key in this.layout) {
                if (this.layout.hasOwnProperty(key)) {
                    result[key] = this.layout[key].getValue(view, fieldOffset);
                    fieldOffset += this.layout[key].length;
                }
            }
            return result;
        };
        this.setValue = (view, offset, value) => {
            let fieldOffset = offset;
            for (const key in this.layout) {
                if (this.layout.hasOwnProperty(key)) {
                    this.layout[key].setValue(view, fieldOffset, value[key]);
                    fieldOffset += this.layout[key].length;
                }
            }
        };
        this.length = getStructLength(layout);
    }
}
class ArrayField {
    constructor(entryField, bufferLength) {
        this.entryField = entryField;
        this.getValue = (view, offset) => {
            const count = Math.floor(this.length / this.entryField.length);
            const result = Array(count);
            for (let i = 0; i < count; i++) {
                result[i] = this.entryField.getValue(view, offset + i * this.entryField.length);
            }
            return result;
        };
        this.setValue = (view, offset, values) => {
            if (values.length !== Math.floor(this.length / this.entryField.length)) {
                throw new Error("Length of value array must match ArrayField count property");
            }
            for (let i = 0; i < values.length; i++) {
                this.entryField.setValue(view, offset + i * this.entryField.length, values[i]);
            }
        };
        this.length = bufferLength;
    }
}
const getStructLength = (struct) => {
    let length = 0;
    for (const key in struct) {
        if (struct.hasOwnProperty(key)) {
            length += struct[key].length;
        }
    }
    return length;
};
//# sourceMappingURL=fields.js.map