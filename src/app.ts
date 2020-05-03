import { Handler } from "./handler";

const handlerInstance = new Handler();

// Entry point to the AWS Lambda
export const handler = handlerInstance.handle.bind(handlerInstance);