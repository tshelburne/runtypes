"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Union = void 0;
var runtype_1 = require("../runtype");
var util_1 = require("../util");
/**
 * Construct a union runtype from runtypes for its alternatives.
 */
function Union() {
    var alternatives = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        alternatives[_i] = arguments[_i];
    }
    var match = function () {
        var cases = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            cases[_i] = arguments[_i];
        }
        return function (x) {
            for (var i = 0; i < alternatives.length; i++) {
                if (alternatives[i].guard(x)) {
                    return cases[i](x);
                }
            }
        };
    };
    var self = { tag: 'union', alternatives: alternatives, match: match };
    return runtype_1.create(function (value, visited) {
        var e_1, _a, e_2, _b;
        if (typeof value !== 'object' || value === null)
            return validate();
        var commonLiteralFields = {};
        try {
            for (var alternatives_1 = __values(alternatives), alternatives_1_1 = alternatives_1.next(); !alternatives_1_1.done; alternatives_1_1 = alternatives_1.next()) {
                var alternative = alternatives_1_1.value;
                if (alternative.reflect.tag === 'record') {
                    var _loop_1 = function (fieldName) {
                        var field = alternative.reflect.fields[fieldName];
                        if (field.tag === 'literal') {
                            if (commonLiteralFields[fieldName]) {
                                if (commonLiteralFields[fieldName].every(function (value) { return value !== field.value; })) {
                                    commonLiteralFields[fieldName].push(field.value);
                                }
                            }
                            else {
                                commonLiteralFields[fieldName] = [field.value];
                            }
                        }
                    };
                    for (var fieldName in alternative.reflect.fields) {
                        _loop_1(fieldName);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (alternatives_1_1 && !alternatives_1_1.done && (_a = alternatives_1.return)) _a.call(alternatives_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        for (var fieldName in commonLiteralFields) {
            if (commonLiteralFields[fieldName].length === alternatives.length) {
                try {
                    for (var alternatives_2 = (e_2 = void 0, __values(alternatives)), alternatives_2_1 = alternatives_2.next(); !alternatives_2_1.done; alternatives_2_1 = alternatives_2.next()) {
                        var alternative = alternatives_2_1.value;
                        if (alternative.reflect.tag === 'record') {
                            var field = alternative.reflect.fields[fieldName];
                            if (field.tag === 'literal' &&
                                util_1.hasKey(fieldName, value) &&
                                value[fieldName] === field.value) {
                                return runtype_1.innerValidate(alternative, value, visited);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (alternatives_2_1 && !alternatives_2_1.done && (_b = alternatives_2.return)) _b.call(alternatives_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        return validate();
        function validate() {
            var e_3, _a;
            var details = [];
            try {
                for (var alternatives_3 = __values(alternatives), alternatives_3_1 = alternatives_3.next(); !alternatives_3_1.done; alternatives_3_1 = alternatives_3.next()) {
                    var alternative = alternatives_3_1.value;
                    var validation = runtype_1.innerValidate(alternative, value, visited);
                    if (validation.success)
                        return util_1.SUCCESS(value);
                    else if (validation.details)
                        details.push(validation.details);
                    else
                        details.push(validation.message);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (alternatives_3_1 && !alternatives_3_1.done && (_a = alternatives_3.return)) _a.call(alternatives_3);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return util_1.FAILURE.CONTENT_INCORRECT(self, details);
        }
    }, self);
}
exports.Union = Union;
