import {localeEnum, localeValues} from "../samples/Locales";

export const channelUiSchema = {
  id: {
    "ui:disabled": true
  },
  name: {
    "ui:disabled": true
  },
  branch: {
    "ui:disabled": true
  },
  branchOf: {
    "ui:disabled": true
  },
  contentRootPath: {
    "ui:disabled": true
  }
}

export const channelSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    name: {
      type: "string"
    },
    branch: {
      type: "string"
    },
    branchOf: {
      type: "string"
    },
    contentRootPath: {
      type: "string"
    },
    locale: {
      type: "string",
      "enum": localeEnum,
      "enumNames": localeValues
    },
    devices: {
      type: "array",
      items: {
        type: "string"
      }
    },
    defaultDevice: {
      type: "string"
    },
    linkurlPrefix: {
      type: ["string", 'null']
    },
    cdnHost: {
      type: ["string", 'null']
    },
    responseHeaders: {
      "type": ["object", 'null'],
      "additionalProperties": {
        "type": "string"
      }
    },
    parameters: {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
  }
};