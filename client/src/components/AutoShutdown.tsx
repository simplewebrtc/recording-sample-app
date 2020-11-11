import { Notifications } from '@andyet/simplewebrtc';
import React from 'react';
​
​
export default class AutoShutdown extends React.Component<any> {
  private shutdownTimeout: any;
​
  public componentDidMount() {
    // In case no one else ever joins
    this.startShutdown();
  }
​
  public startShutdown() {
    if (!this.shutdownTimeout) {
      this.shutdownTimeout = setTimeout(() => {
        window.location.href = '/recording-complete'
      }, 10000)
    }
  }
​
  public pauseShutdown() {
    clearTimeout(this.shutdownTimeout);
    this.shutdownTimeout = undefined;
  }
​
  public render() {
    return (
      <Notifications
        onPeerEntered={() => this.pauseShutdown()}
        onNoPeersRemaining={() => this.startShutdown()}
      />
    )
  }
}
​