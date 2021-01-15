import React from "react";

type GlobalState = {
  severity: 'error' | 'success'
  message: string
  timeOut: number
  open: boolean
}

type GlobalType = {
  severity: string
  message: string
  timeOut: number
  open: boolean
  logError: (message: string) => void;
  logSuccess: (message: string) => void;
  onClose: () => void;
}

export const GlobalContext = React.createContext<Partial<GlobalType>>({});

export default class GlobalProvider extends React.Component<{}, GlobalState> {
  constructor (props:{}) {
    super(props);
    // Initialize the state
    this.state = {
      severity: 'error',
      message: "",
      timeOut: 2000,
      open: false,
    };
    this.onClose = this.onClose.bind(this);
    this.logSuccess = this.logSuccess.bind(this);
    this.logError = this.logError.bind(this);
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

  render () {
    return (
      <GlobalContext.Provider value={{...this.state,
        logError: this.logError,
        logSuccess: this.logSuccess,
        onClose: this.onClose}}>
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}



