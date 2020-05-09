export interface RequestHandler<REQUEST, RESPONSE> {
    canHandle(request: REQUEST): boolean
    handle(request: REQUEST): RESPONSE
}