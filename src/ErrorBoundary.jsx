import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log client-side crashes for observability pipelines.
    console.error('Unhandled application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--app-bg)',
            color: 'var(--app-text)',
            padding: '1rem',
          }}
        >
          <section
            style={{
              maxWidth: 560,
              width: '100%',
              border: '1px solid var(--panel-border)',
              borderRadius: 16,
              padding: 24,
              background: 'var(--panel-bg)',
            }}
          >
            <h1 style={{ color: 'var(--app-text)', margin: '0 0 8px' }}>Something went wrong</h1>
            <p style={{ margin: 0 }}>
              The dashboard encountered an unexpected error. Please refresh the page.
            </p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}