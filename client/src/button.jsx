import React, { useState } from 'react';
import './button.css';  // Import the CSS file

const Button = ({isOn,handleSwitchChange}) => {

  return (
    <div className="box">
      <label>
        <input type="checkbox" checked={isOn} onChange={handleSwitchChange} />
        <span>
          <i className={`fa fa-power-off ${isOn ? 'on' : ''}`} aria-hidden="true"></i>
        </span>
      </label>
      <div id="led" style={{ display: isOn ? 'block' : 'none' }}>hello</div>
    </div>
  );
};

export default Button;
