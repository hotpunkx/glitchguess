import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t-4 border-accent">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="text-center space-y-2">
        </div>
      </div>
    </footer>
  );
};

export default Footer;
