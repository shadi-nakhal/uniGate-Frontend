import { useState, useRef, useEffect } from "react";

function useVisible(initialIsVisible) {
  const [isVisible, setIsVisible] = useState(initialIsVisible);
  const ref = useRef(null);
  const ref2 = useRef(null)
  const handleClickOutside = (event) => {
    
    if (ref.current && !ref.current.contains(event.target) && !ref2.current.contains(event.target) ) {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };

  }, []);
 
  return { ref, ref2, isVisible, setIsVisible };
}
 
export default useVisible;