import React from "react";

function TokenCount({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`pr-2 text-right text-xs ${className}}`}>{children}</div>
  );
}

export default TokenCount;
