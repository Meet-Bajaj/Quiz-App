// components/Dashboard/StatsCard.jsx
import React, { memo } from 'react';
// import PropTypes from 'prop-types';

const StatsCard = memo(({ title, value, valueColor = 'text-gray-500', icon }) => (
  <div className="flex justify-between items-center px-6 py-4 bg-zinc-900 rounded-full hover:bg-zinc-700 transition-colors duration-200">
    <div className="flex items-center gap-3">
      {icon && <span className="text-lg">{icon}</span>}
      <span className="font-medium">{title}</span>
    </div>
    <span className={`text-xl font-semibold ${valueColor}`}>
      {value}
    </span>
  </div>
));

StatsCard.displayName = 'StatsCard';

// StatsCard.propTypes = {
//   title: PropTypes.string.isRequired,
//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//   valueColor: PropTypes.string,
//   icon: PropTypes.string
// };

export default StatsCard;
