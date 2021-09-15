import {LogContextType} from "../LogContext";

export function getId () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 9);
}

export function isNotEmptyOrNull (array: any) {
  return (typeof array !== 'undefined' && array.length > 0);
}

export function logError (message: string, context?: LogContextType | Partial<LogContextType>) {
  context && context.logError && context.logError(message);
}

export function logSuccess (message: string, context?: LogContextType | Partial<LogContextType>) {
  context && context.logSuccess && context.logSuccess(message);
}

export function setEndpoint (endpoint: string, context?: LogContextType | Partial<LogContextType>) {
  context && context.setEndpoint && context.setEndpoint(endpoint);
}

export const getNodeKey = ({node}: any) => node.id;

