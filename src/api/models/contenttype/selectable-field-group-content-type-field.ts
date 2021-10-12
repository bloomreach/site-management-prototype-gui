/* tslint:disable */
/* eslint-disable */
/**
 * Content Type Management API
 * The Content Type Management API enables brX developers to manage content types through a set of endpoints
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import {ContentTypeField} from "./content-type-field";

/**
 * 
 * @export
 * @interface SelectableFieldGroupContentTypeField
 */
export interface SelectableFieldGroupContentTypeField extends ContentTypeField {
    /**
     * fieldGroupTypes validation of the field. Expects an array of field group names
     * @type {Array&lt;string&gt;}
     * @memberof SelectableFieldGroupContentTypeField
     */
    fieldGroupTypes: Array<string>;
}