import React, { useRef } from 'react';
import useFetch from './useFetch';
import {
  useLocalStorage,
  useDebounce,
  useWindowSize,
  usePrevious,
  useHover,
  useOnClickOutside,
  useTimeout,
  useIntersectionObserver,
  useMediaQuery
} from './useFetch';

function App() {
  // Example for useFetch
  const { data, loading, error } = useFetch('https://api.example.com/data');

  // Example for useLocalStorage
  const [storedValue, setStoredValue] = useLocalStorage('myKey', 'default');

  // Example for useDebounce
  const debouncedValue = useDebounce(storedValue, 500);

  // Example for useWindowSize
  const windowSize = useWindowSize();

  // Example for usePrevious
  const prevValue = usePrevious(storedValue);

  // Example for useHover
  const [hoverRef, isHovered] = useHover();

  // Example for useOnClickOutside
  const ref = useRef();
  useOnClickOutside(ref, () => alert('Clicked outside!'));

  // Example for useTimeout
  const clearTimeout = useTimeout(() => alert('Timeout triggered!'), 5000);

  // Example for useIntersectionObserver
  const elementRef = useRef();
  const isIntersecting = useIntersectionObserver(elementRef, { threshold: 0.5 });

  // Example for useMediaQuery
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  return (
    <div>
      <h1>Custom Hooks Demo</h1>
      
      {/* useFetch example */}
      {loading ? <p>Loading...</p> : error ? <p>Error: {error.message}</p> : <p>Data: {JSON.stringify(data)}</p>}

      {/* useLocalStorage example */}
      <input value={storedValue} onChange={(e) => setStoredValue(e.target.value)} />
      <p>Debounced Value: {debouncedValue}</p>

      {/* useWindowSize example */}
      <p>Window size: {windowSize.width} x {windowSize.height}</p>

      {/* usePrevious example */}
      <p>Previous value: {prevValue}</p>

      {/* useHover example */}
      <div ref={hoverRef} style={{ padding: '20px', backgroundColor: isHovered ? 'lightgreen' : 'lightgray' }}>
        Hover over this box
      </div>

      {/* useOnClickOutside example */}
      <div ref={ref} style={{ padding: '20px', border: '1px solid black' }}>
        Click outside this box to trigger an alert
      </div>

      {/* useIntersectionObserver example */}
      <div ref={elementRef} style={{ marginTop: '100vh', height: '100px', backgroundColor: 'lightblue' }}>
        {isIntersecting ? 'Element is in view!' : 'Scroll down to see the element'}
      </div>

      {/* useMediaQuery example */}
      <p>{isSmallScreen ? 'Small screen' : 'Large screen'}</p>

      <button onClick={clearTimeout}>Cancel Timeout</button>
    </div>
  );
}

export default App;
