import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t-4 border-accent">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="text-center space-y-2">
          <p className="text-white text-sm">
            With ❤️ by{' '}
            <a
              href="https://x.com/IamIsPra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-white transition-colors font-bold"
            >
              IamIsPra
            </a>
            {' '}in LK
          </p>
          <p className="text-white/60 text-xs">
            {currentYear} GLITCHGUESS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
