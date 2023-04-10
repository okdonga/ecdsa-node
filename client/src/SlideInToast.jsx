import React, { useState, useEffect } from "react";

function SlideInToast({ message, duration = 5000, onClose, options }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);

    const timeout = setTimeout(() => {
        handleClose();
    }, duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);

    if (onClose) {
      onClose();
    }
  };

  const bgColor = {
    'success': '#4cd0ce',
    'error': '#aaa',
  }
  const customStyle = {
    backgroundColor: bgColor[options?.status],
  }
  
  return (
    <div className={`SlideInToast ${visible ? "visible" : ""}`} style={customStyle}>
      <div className="message">{message}</div>
      <button type="button" className="closeButton" onClick={handleClose}>X</button>
    </div>
  );
}

export default SlideInToast;
