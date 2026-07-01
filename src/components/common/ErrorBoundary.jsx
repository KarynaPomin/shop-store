import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="state-page">
          <h1>Something went out of style.</h1>
          <p>Refresh the page and the shop should be ready again.</p>
        </main>
      );
    }

    return this.props.children;
  }
}
