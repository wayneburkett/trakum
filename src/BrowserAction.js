import React, { useEffect, useState } from "react";

function BrowserAction() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setTimeout(() => setInitialized(true), 3000);
  }, []);

  return (
    <div className="page">
      <h1>Trakum</h1>
      <p>{initialized ? 'initialized' : 'uninitialized'}</p>
    </div>
  );
}

export default BrowserAction;

