import { useState, useEffect, useRef } from 'react';

// Cache to store fetched data
const dataCache = new Map();

function useFetch(url, options = {}, retries = 3, retryDelay = 1000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const retryCount = useRef(0);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Check cache
      if (dataCache.has(url)) {
        setData(dataCache.get(url));
        setLoading(false);
        return;
      }

      const attemptFetch = async () => {
        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          dataCache.set(url, result); // Cache the result
          setData(result);
          setLoading(false);
        } catch (err) {
          if (retryCount.current < retries) {
            retryCount.current++;
            setTimeout(attemptFetch, retryDelay);
          } else {
            setError(err);
            setLoading(false);
          }
        }
      };

      attemptFetch();
    };

    fetchData();
  }, [url, options, retries, retryDelay]);

  return { data, loading, error };
}

export default useFetch;

// Custom hook: useLocalStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error setting localStorage", error);
    }
  };

  return [storedValue, setValue];
}

export { useLocalStorage };

// Custom hook: useDebounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export { useDebounce };

// Custom hook: useWindowSize
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export { useWindowSize };

// Custom hook: usePrevious
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export { usePrevious };

// Custom hook: useHover
function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseOver = () => setIsHovered(true);
    const handleMouseOut = () => setIsHovered(false);

    const node = ref.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      if (node) {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      }
    };
  }, []);

  return [ref, isHovered];
}

export { useHover };

// Custom hook: useOnClickOutside
function useOnClickOutside(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}

export { useOnClickOutside };

// Custom hook: useTimeout
function useTimeout(callback, delay) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (delay !== null) {
      timeoutRef.current = setTimeout(callback, delay);
      return () => clearTimeout(timeoutRef.current);
    }
  }, [callback, delay]);

  const clear = () => clearTimeout(timeoutRef.current);

  return clear;
}

export { useTimeout };

// Custom hook: useIntersectionObserver
function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isIntersecting;
}

export { useIntersectionObserver };

// Custom hook: useMediaQuery
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event) => setMatches(event.matches);

    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener('change', listener);

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

export { useMediaQuery };
