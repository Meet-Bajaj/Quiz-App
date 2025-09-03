// components/UI/Card.jsx
// import PropTypes from 'prop-types';

const Card = ({ children, className = '', padding = 'p-4', ...props }) => (
  <div 
    className={`bg-zinc-800 rounded-lg ${padding} ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// Card.propTypes = {
//   children: PropTypes.node.isRequired,
//   className: PropTypes.string,
//   padding: PropTypes.string
// };

export default Card;
