import React from 'react';
import { createRoot } from 'react-dom/client';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { trace, context } from '@opentelemetry/api';  // Removed unused 'propagation'

import App from './App';
import './index.css';

// Set up OpenTelemetry WebTracerProvider and configure the service name
const provider = new WebTracerProvider({
  resource: new Resource({
    'service.name': 'frontend-service',  // Set the service name for your front-end
  }),
});

// Set up the OTLP exporter, pointing to the OpenTelemetry Collector
const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',  // Ensure the OTLP Collector is listening at this address
});

// Add the SimpleSpanProcessor to the provider
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

// Register the provider, so the traces are captured
provider.register();

// Get a tracer instance
const tracer = trace.getTracer('frontend-app');

// Example: Start a root span for the page load
const rootSpan = tracer.startSpan('page-load');

// Store the trace context so it can be reused for subsequent spans
const rootContext = trace.setSpan(context.active(), rootSpan);

// End the span after the page has loaded (you can delay this if needed)
window.onload = () => {
  rootSpan.end();
};

// Render the React App using React 18's createRoot
const container = document.getElementById('root');
const root = createRoot(container);  // Create a root
root.render(<App rootContext={rootContext} />);  // Pass the root context to the App component