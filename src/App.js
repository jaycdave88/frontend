import React, { useState } from 'react';
import './App.css';
import { trace } from '@opentelemetry/api';  // Remove 'propagation' and 'context' if unused

function App({ rootContext }) {
  const [count, setCount] = useState(0);  // State to store the click count
  const tracer = trace.getTracer('frontend-app');

  const handleClick = async () => {
    // Use the rootContext from the page load span
    const span = tracer.startSpan('button-click', {}, rootContext);

    // Use OpenTelemetry API to get the active span context
    const spanContext = span.spanContext();
    const traceparent = `00-${spanContext.traceId}-${spanContext.spanId}-01`;

    // Include the trace context headers in the fetch request to the backend
    const headers = new Headers({
      'Content-Type': 'application/json',
      'traceparent': traceparent,
    });

    // Fetch request to the backend API
    fetch('http://localhost:3001/api/data', { headers })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Received data from backend:', data);
        setCount(data.count);  // Update the count with the response
        span.end();  // End the span after receiving the response
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        span.end();  // End the span even if there was an error
      });
  };

  return (
    <div className="App">
      <h1>Hello, OpenTelemetry!</h1>
      <button onClick={handleClick}>Click Me to Trigger Backend</button>
      <p>Button clicked {count} times</p> {/* Display the count */}
    </div>
  );
}

export default App;