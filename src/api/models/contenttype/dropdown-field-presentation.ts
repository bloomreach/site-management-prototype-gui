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
/**
 * 
 * @export
 * @interface DropdownFieldPresentation
 */
export interface DropdownFieldPresentation {
    /**
     * the caption used for this field in UIs
     * @type {string}
     * @memberof DropdownFieldPresentation
     */
    caption: any;
    /**
     * the hint used for this field in UIs
     * @type {string}
     * @memberof DropdownFieldPresentation
     */
    hint: any;
    /**
     * layoutColumn index used for positioning the field
     * @type {number}
     * @memberof DropdownFieldPresentation
     */
    layoutColumn?: any;
    /**
     * display type of the field. Valid values: RadioGroup, Dropdown, MultiSelect
     * @type {string}
     * @memberof DropdownFieldPresentation
     */
    displayType: DropdownFieldPresentationDisplayTypeEnum;
    /**
     * sortOrder type of the field. Valid values: ascending, descending
     * @type {string}
     * @memberof DropdownFieldPresentation
     */
    sortOrder?: DropdownFieldPresentationSortOrderEnum;
    /**
     * sortBy type of the field. Valid values: key, label
     * @type {string}
     * @memberof DropdownFieldPresentation
     */
    sortBy?: DropdownFieldPresentationSortByEnum;
    /**
     * showDefault type of the field.
     * @type {boolean}
     * @memberof DropdownFieldPresentation
     */
    showDefault?: any;
}

/**
    * @export
    * @enum {string}
    */
export enum DropdownFieldPresentationDisplayTypeEnum {
    Simple = 'Simple',
    Text = 'Text',
    Checkbox = 'Checkbox',
    RadioGroup = 'RadioGroup',
    Dropdown = 'Dropdown',
    MultiSelect = 'MultiSelect',
    AnyLink = 'AnyLink',
    ImageLink = 'ImageLink'
}
/**
    * @export
    * @enum {string}
    */
export enum DropdownFieldPresentationSortOrderEnum {
    Ascending = 'ascending',
    Descending = 'descending'
}
/**
    * @export
    * @enum {string}
    */
export enum DropdownFieldPresentationSortByEnum {
    Key = 'key',
    Label = 'label'
}

