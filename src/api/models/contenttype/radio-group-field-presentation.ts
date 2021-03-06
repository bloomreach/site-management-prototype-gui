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
 * @interface RadioGroupFieldPresentation
 */
export interface RadioGroupFieldPresentation {
    /**
     * the caption used for this field in UIs
     * @type {string}
     * @memberof RadioGroupFieldPresentation
     */
    caption: any;
    /**
     * the hint used for this field in UIs
     * @type {string}
     * @memberof RadioGroupFieldPresentation
     */
    hint: any;
    /**
     * layoutColumn index used for positioning the field
     * @type {number}
     * @memberof RadioGroupFieldPresentation
     */
    layoutColumn?: any;
    /**
     * display type of the field. Valid values: RadioGroup, Dropdown, MultiSelect
     * @type {string}
     * @memberof RadioGroupFieldPresentation
     */
    displayType: RadioGroupFieldPresentationDisplayTypeEnum;
    /**
     * orientation type of the field.
     * @type {string}
     * @memberof RadioGroupFieldPresentation
     */
    orientation?: RadioGroupFieldPresentationOrientationEnum;
    /**
     * sortOrder type of the field.
     * @type {string}
     * @memberof RadioGroupFieldPresentation
     */
    sortOrder?: RadioGroupFieldPresentationSortOrderEnum;
    /**
     * sortBy type of the field.
     * @type {string}
     * @memberof RadioGroupFieldPresentation
     */
    sortBy?: RadioGroupFieldPresentationSortByEnum;
}

/**
    * @export
    * @enum {string}
    */
export enum RadioGroupFieldPresentationDisplayTypeEnum {
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
export enum RadioGroupFieldPresentationOrientationEnum {
    Vertical = 'vertical',
    Horizontal = 'horizontal'
}
/**
    * @export
    * @enum {string}
    */
export enum RadioGroupFieldPresentationSortOrderEnum {
    Ascending = 'ascending',
    Descending = 'descending'
}
/**
    * @export
    * @enum {string}
    */
export enum RadioGroupFieldPresentationSortByEnum {
    Key = 'key',
    Label = 'label'
}

