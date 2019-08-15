import httpStatus from 'http-status';
import { Response } from 'express';
import {ValidationError} from "class-validator";

/**
 * This method helps to prepare the response object
 * @param {number} code
 * @param {boolean} success
 * @param {string} message
 * @returns {{code: number; success: boolean; message: string}}
 */
function data(code: number, success: boolean, message: string) {
  return {
    code,
    success,
    message
  };
}

/**
 * This method helps in returning the success response to the client with status code 200
 * @param {e.Response} res
 * @param data
 * @returns {Response}
 */
export function dataResponse(res: Response, data: any) {
  return res.status(httpStatus.OK).json({ code: httpStatus.OK, success: true, data });
}

/**
 * This method helps in returning 404 Not Found response to the client
 * @param {e.Response} res
 * @param {string} message
 * @returns {Response}
 */
export function notFoundResponse(res: Response, message: string) {
  return res.status(httpStatus.NOT_FOUND).json(data(httpStatus.NOT_FOUND, false, message));
}

/**
 * This method helps in returning bad request with status code 400
 * @param {e.Response} res
 * @param {string} message
 * @returns {Response}
 */
export function badRequestResponse(res: Response, message: string) {
  return res.status(httpStatus.BAD_REQUEST).json(data(httpStatus.BAD_REQUEST, false, message));
}

/**
 * This method helps in returning validation error with status code 400
 * @param {e.Response} res
 * @param {string} message
 * @returns {Response}
 */
export function badRequestValidationResponse(res: Response, errors: ValidationError[]) {
  return res.status(httpStatus.BAD_REQUEST).json({code: httpStatus.BAD_REQUEST, success: false, errors: errors});
}

/**
 * This mehod helps in returning authorization error response with status code 401
 * @param {e.Response} res
 * @param {string} message
 * @returns {Response}
 */
export function unauthorizeResponse(res: Response, message: string) {
  return res.status(httpStatus.UNAUTHORIZED).json(data(httpStatus.UNAUTHORIZED, false, message));
}

/**
 * This method helps in returning conflict response with status code 409
 * @param {e.Response} res
 * @param {string} message
 * @returns {Response}
 */
export function conflictResponse(res: Response, message: string) {
  return res.status(httpStatus.CONFLICT).json(data(httpStatus.CONFLICT, false, message));
}

/**
 * This method helps in returning internal server error response with status code 500
 * @param {e.Response} res
 * @returns {Response}
 */
export function internalResponse(res: Response) {
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(data(httpStatus.INTERNAL_SERVER_ERROR, false, 'Internal server error, try again later'));
}