"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var struct_1 = require("./struct");
exports.Fields = {
    Int8: function () { return new Int8Field(); },
    Int16: function (endianness) {
        if (endianness === void 0) { endianness = struct_1.Endianess.little; }
        return new Int16Field(endianness);
    },
    Int32: function (endianness) {
        if (endianness === void 0) { endianness = struct_1.Endianess.little; }
        return new Int32Field(endianness);
    },
    Uint8: function () { return new Uint8Field(); },
    Uint16: function (endianness) {
        if (endianness === void 0) { endianness = struct_1.Endianess.little; }
        return new Uint16Field(endianness);
    },
    Uint32: function (endianness) {
        if (endianness === void 0) { endianness = struct_1.Endianess.little; }
        return new Uint32Field(endianness);
    },
    String: function (length) { return new StringField(length); },
    Struct: function (layout) { return new StructField(layout); },
    Array: function (field, bufferLength) { return new ArrayField(field, bufferLength); },
};
// tslint:disable:max-classes-per-file
var Uint8Field = /** @class */ (function () {
    function Uint8Field() {
        this.length = 1;
        this.getValue = function (view, offset) { return view.getUint8(offset); };
        this.setValue = function (view, offset, value) { return view.setUint8(offset, value); };
    }
    return Uint8Field;
}());
var Uint16Field = /** @class */ (function () {
    function Uint16Field(endianess) {
        if (endianess === void 0) { endianess = struct_1.Endianess.little; }
        var _this = this;
        this.endianess = endianess;
        this.length = 2;
        this.getValue = function (view, offset) { return view.getUint16(offset, _this.endianess === struct_1.Endianess.little); };
        this.setValue = function (view, offset, value) { return view.setUint16(offset, value, _this.endianess === struct_1.Endianess.little); };
    }
    return Uint16Field;
}());
var Uint32Field = /** @class */ (function () {
    function Uint32Field(endianess) {
        if (endianess === void 0) { endianess = struct_1.Endianess.little; }
        var _this = this;
        this.endianess = endianess;
        this.length = 4;
        this.getValue = function (view, offset) { return view.getUint32(offset, _this.endianess === struct_1.Endianess.little); };
        this.setValue = function (view, offset, value) { return view.setUint32(offset, value, _this.endianess === struct_1.Endianess.little); };
    }
    return Uint32Field;
}());
var Int8Field = /** @class */ (function () {
    function Int8Field() {
        this.length = 1;
        this.getValue = function (view, offset) { return view.getInt8(offset); };
        this.setValue = function (view, offset, value) { return view.setInt8(offset, value); };
    }
    return Int8Field;
}());
var Int16Field = /** @class */ (function () {
    function Int16Field(endianess) {
        if (endianess === void 0) { endianess = struct_1.Endianess.little; }
        var _this = this;
        this.endianess = endianess;
        this.length = 2;
        this.getValue = function (view, offset) { return view.getInt16(offset, _this.endianess === struct_1.Endianess.little); };
        this.setValue = function (view, offset, value) { return view.setInt16(offset, value, _this.endianess === struct_1.Endianess.little); };
    }
    return Int16Field;
}());
var Int32Field = /** @class */ (function () {
    function Int32Field(endianess) {
        if (endianess === void 0) { endianess = struct_1.Endianess.little; }
        var _this = this;
        this.endianess = endianess;
        this.length = 4;
        this.getValue = function (view, offset) { return view.getInt32(offset, _this.endianess === struct_1.Endianess.little); };
        this.setValue = function (view, offset, value) { return view.setInt32(offset, value, _this.endianess === struct_1.Endianess.little); };
    }
    return Int32Field;
}());
var StringField = /** @class */ (function () {
    function StringField(length) {
        var _this = this;
        this.length = length;
        this.getValue = function (view, offset) {
            var bytes = [];
            for (var i = 0; i < _this.length; i++) {
                var char = view.getUint8(i + offset);
                if (char === 0) {
                    break;
                }
                bytes[i] = char;
            }
            return String.fromCharCode.apply(null, bytes);
        };
        this.setValue = function (view, offset, value) {
            for (var i = 0; i < _this.length; i++) {
                view.setInt8(i + offset, value.charCodeAt(i));
            }
        };
    }
    return StringField;
}());
var StructField = /** @class */ (function () {
    function StructField(layout) {
        var _this = this;
        this.layout = layout;
        this.getValue = function (view, offset) {
            var result = {};
            var fieldOffset = offset;
            for (var key in _this.layout) {
                if (_this.layout.hasOwnProperty(key)) {
                    result[key] = _this.layout[key].getValue(view, fieldOffset);
                    fieldOffset += _this.layout[key].length;
                }
            }
            return result;
        };
        this.setValue = function (view, offset, value) {
            var fieldOffset = offset;
            for (var key in _this.layout) {
                if (_this.layout.hasOwnProperty(key)) {
                    _this.layout[key].setValue(view, fieldOffset, value[key]);
                    fieldOffset += _this.layout[key].length;
                }
            }
        };
        this.length = getStructLength(layout);
    }
    return StructField;
}());
var ArrayField = /** @class */ (function () {
    function ArrayField(entryField, bufferLength) {
        var _this = this;
        this.entryField = entryField;
        this.getValue = function (view, offset) {
            var count = Math.floor(_this.length / _this.entryField.length);
            var result = Array(count);
            for (var i = 0; i < count; i++) {
                result[i] = _this.entryField.getValue(view, offset + i * _this.entryField.length);
            }
            return result;
        };
        this.setValue = function (view, offset, values) {
            if (values.length !== Math.floor(_this.length / _this.entryField.length)) {
                throw new Error("Length of value array must match ArrayField count property");
            }
            for (var i = 0; i < values.length; i++) {
                _this.entryField.setValue(view, offset + i * _this.entryField.length, values[i]);
            }
        };
        this.length = bufferLength;
    }
    return ArrayField;
}());
var getStructLength = function (struct) {
    var length = 0;
    for (var key in struct) {
        if (struct.hasOwnProperty(key)) {
            length += struct[key].length;
        }
    }
    return length;
};
//# sourceMappingURL=fields.js.map