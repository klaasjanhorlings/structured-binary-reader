"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fields = {
    /**
     * Reads a signed 1 byte integer
     * @param options.offset the number of bytes to offset this field by. Defaults to 0
     */
    Int8: (options) => new Int8Field(options),
    /**
     * Reads a signed 2 byte integer
     * @param options.offset the number of bytes to offset this field by. Defaults to 0
     * @param options.endianess little (0) or big (1) endianess. Defaults to little
     */
    Int16: (options) => new Int16Field(options),
    /**
     * Reads a signed 4 byte integer
     * @param options.offset the number of bytes to offset this field by. Defaults to 0
     * @param options.endianess little (0) or big (1) endianess. Defaults to little
     */
    Int32: (options) => new Int32Field(options),
    /**
     * Reads an unsigned 1 byte integer
     * @param options.offset the number of bytes to offset this field by. Defaults to 0
     * @param options.endianess little (0) or big (1) endianess. Defaults to little
     */
    Uint8: (options) => new Uint8Field(options),
    /**
     * Reads an unsigned 2 byte integer
     * @param options.offset the number of bytes to offset this field by. Defaults to 0
     * @param options.endianess little (0) or big (1) endianess. Defaults to little
     */
    Uint16: (options) => new Uint16Field(options),
    /**
     * Reads an unsigned 4 byte integer
     * @param options.offset the number of bytes to offset this field by. Defaults to 0
     * @param options.endianess little (0) or big (1) endianess. Defaults to little
     */
    Uint32: (options) => new Uint32Field(options),
    String: (options) => new StringField(options),
    Struct: (layout) => new StructField(layout),
    Array: (field, bufferLength) => new ArrayField(field, bufferLength),
};
class Uint8Field {
    constructor(options) {
        this.length = 1;
        this.offset = 0;
        this.getValue = (view, offset) => view.getUint8(offset + this.offset);
        this.setValue = (view, offset, value) => view.setUint8(offset + this.offset, value);
        if (typeof (options) !== "undefined") {
            if (typeof (options.offset) === "number") {
                this.offset = options.offset;
            }
        }
    }
}
class Uint16Field {
    constructor(options) {
        this.length = 2;
        this.offset = 0;
        this.endianess = 0 /* little */;
        this.getValue = (view, offset) => view.getUint16(offset + this.offset, this.endianess === 0 /* little */);
        this.setValue = (view, offset, value) => view.setUint16(offset + this.offset, value, this.endianess === 0 /* little */);
        if (typeof (options) !== "undefined") {
            if (typeof (options.offset) === "number") {
                this.offset = options.offset;
            }
            if (typeof (options.endianess) === "number") {
                this.endianess = options.endianess;
            }
        }
    }
}
class Uint32Field {
    constructor(options) {
        this.length = 4;
        this.offset = 0;
        this.endianess = 0 /* little */;
        this.getValue = (view, offset) => view.getUint32(offset + this.offset, this.endianess === 0 /* little */);
        this.setValue = (view, offset, value) => view.setUint32(offset + this.offset, value, this.endianess === 0 /* little */);
        if (typeof (options) !== "undefined") {
            if (typeof (options.offset) === "number") {
                this.offset = options.offset;
            }
            if (typeof (options.endianess) === "number") {
                this.endianess = options.endianess;
            }
        }
    }
}
class Int8Field {
    constructor(options) {
        this.length = 1;
        this.offset = 0;
        this.getValue = (view, offset) => view.getInt8(offset + this.offset);
        this.setValue = (view, offset, value) => view.setInt8(offset + this.offset, value);
        if (typeof (options) !== "undefined") {
            if (typeof (options.offset) === "number") {
                this.offset = options.offset;
            }
        }
    }
}
class Int16Field {
    constructor(options) {
        this.length = 2;
        this.offset = 0;
        this.endianess = 0 /* little */;
        this.getValue = (view, offset) => view.getInt16(offset + this.offset, this.endianess === 0 /* little */);
        this.setValue = (view, offset, value) => view.setInt16(offset + this.offset, value, this.endianess === 0 /* little */);
        if (typeof (options) !== "undefined") {
            if (typeof (options.offset) === "number") {
                this.offset = options.offset;
            }
            if (typeof (options.endianess) === "number") {
                this.endianess = options.endianess;
            }
        }
    }
}
class Int32Field {
    constructor(options) {
        this.length = 4;
        this.offset = 0;
        this.endianess = 0 /* little */;
        this.getValue = (view, offset) => view.getInt32(offset + this.offset, this.endianess === 0 /* little */);
        this.setValue = (view, offset, value) => view.setInt32(offset + this.offset, value, this.endianess === 0 /* little */);
        if (typeof (options) !== "undefined") {
            if (typeof (options.offset) === "number") {
                this.offset = options.offset;
            }
            if (typeof (options.endianess) === "number") {
                this.endianess = options.endianess;
            }
        }
    }
}
class StringField {
    constructor(options) {
        this.offset = 0;
        this.getValue = (view, offset) => {
            const bytes = [];
            for (let i = 0; i < this.length; i++) {
                const char = view.getUint8(i + offset + this.offset);
                if (char === 0) {
                    break;
                }
                bytes[i] = char;
            }
            return String.fromCharCode.apply(null, bytes);
        };
        this.setValue = (view, offset, value) => {
            for (let i = 0; i < this.length; i++) {
                if (i < value.length) {
                    view.setInt8(i + offset + this.offset, value.charCodeAt(i));
                }
                else {
                    view.setInt8(i + offset + this.offset, 0);
                }
            }
        };
        if (typeof (options.offset) === "number") {
            this.offset = options.offset;
        }
        this.length = options.length;
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