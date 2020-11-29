import React from 'react'

const EndpointContext = React.createContext('');

export const EndpointProvider = EndpointContext.Provider
export const EndpointConsumer = EndpointContext.Consumer

export default EndpointContext