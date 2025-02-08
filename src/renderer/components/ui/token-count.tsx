import React from "react";

function TokenCount({ children }: { children: React.ReactNode }) {
  return <div className="pr-2 text-right text-xs">{children}</div>;
}

export default TokenCount;
