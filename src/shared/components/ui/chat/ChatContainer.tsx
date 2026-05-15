import React from "react";

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-col w-full max-w-4xl mx-auto h-full ${className}`}>
      {children}
    </div>
  );
};
