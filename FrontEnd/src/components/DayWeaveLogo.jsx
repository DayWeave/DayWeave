import React from 'react';
import DayWeaveLogoWithText from '../assets/DayWeaveLogo.png';
import DayWeaveLogoIcon from '../assets/DayWeaveLogoNoWords.png';

const DayWeaveLogo = ({ size = 120, showText = true, className = "" }) => {
  const logoImage = showText ? DayWeaveLogoWithText : DayWeaveLogoIcon;
  
  return (
    <div className={`dayweave-logo ${className}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <img 
        src={logoImage} 
        alt="DayWeave Logo" 
        style={{ 
          width: size, 
          height: size, 
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
        }}
      />
    </div>
  );
};

export default DayWeaveLogo;
