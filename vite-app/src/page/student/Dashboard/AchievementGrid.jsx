// components/Dashboard/AchievementGrid.jsx
import React, { memo } from 'react';
// import PropTypes from 'prop-types';

const AchievementItem = memo(({ icon, title, bgColor, description }) => (
  <div className="text-center group cursor-pointer">
    <div className={`bg-${bgColor}-500 p-4 rounded-full group-hover:scale-110 transition-transform duration-200 mx-auto w-16 h-16 flex items-center justify-center`}>
      <span className="text-white text-2xl">{icon}</span>
    </div>
    <p className="mt-2 font-medium">{title}</p>
    {description && (
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    )}
  </div>
));

AchievementItem.displayName = 'AchievementItem';

const AchievementGrid = ({ achievements = [] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {achievements.map((achievement, index) => (
      <AchievementItem key={achievement.id || index} {...achievement} />
    ))}
  </div>
);

// AchievementItem.propTypes = {
//   icon: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   bgColor: PropTypes.string.isRequired,
//   description: PropTypes.string
// };

// AchievementGrid.propTypes = {
//   achievements: PropTypes.arrayOf(PropTypes.object)
// };

export default AchievementGrid;
