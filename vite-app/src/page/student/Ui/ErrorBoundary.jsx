// components/UI/ErrorBoundary.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="w-full h-full flex flex-col justify-center items-center text-center p-8">
    <div className="text-red-500 text-6xl mb-4">⚠️</div>
    <h2 className="text-xl font-semibold mb-2 text-red-400">Oops! Something went wrong</h2>
    <p className="text-gray-400 mb-6 max-w-md">{error}</p>
    {onRetry && (
      <Button variant="primary" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </div>
);

ErrorDisplay.propTypes = {
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func
};

export default ErrorDisplay;
