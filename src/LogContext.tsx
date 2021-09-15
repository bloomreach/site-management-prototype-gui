import React from "react";

type LogProviderState = {
  severity: 'error' | 'success'
  message: string
  timeOut: number
  open: boolean
  endpoint: string | undefined
}

export interface LogContextType extends LogProviderState {
  logError: (message: string) => void;
  logSuccess: (message: string) => void;
  onClose: () => void;
  setEndpoint: (endpoint: string) => void;
}

export const LogContext = React.createContext<Partial<LogContextType>>({});

export default class LogProvider extends React.Component<{}, LogProviderState> {
  constructor (props: {}) {
    super(props);
    // Initialize the state
    this.state = {
      severity: 'error',
      message: "",
      timeOut: 6000,
      open: false,
      endpoint: undefined
    };
    this.onClose = this.onClose.bind(this);
    this.logSuccess = this.logSuccess.bind(this);
    this.logError = this.logError.bind(this);
    this.setEndpoint = this.setEndpoint.bind(this);
  }

  logError = (message: string) => {
    this.setState({message: message, severity: 'error', open: true, timeOut: 2000})
  };

  logSuccess = (message: string) => {
    this.setState({message: message, severity: 'success', open: true, timeOut: 2000})
  };

  onClose = () => {
    this.setState({open: false})
  };

  setEndpoint = (endpoint: string) => {
    this.setState({endpoint: endpoint});
  }

  render () {
    return (
      <LogContext.Provider value={{
        ...this.state,
        logError: this.logError,
        logSuccess: this.logSuccess,
        onClose: this.onClose,
        setEndpoint: this.setEndpoint
      }}>
        {this.props.children}
      </LogContext.Provider>
    );
  }
}



