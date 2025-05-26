import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  isHoverable = false,
  noPadding = false,
}) => {
  const baseStyles = 'bg-white rounded-lg shadow-sm border border-gray-200';
  const hoverStyles = isHoverable ? 'transition-shadow hover:shadow-md' : '';
  const paddingStyles = noPadding ? '' : 'p-4';
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {(title || subtitle) && (
        <div className={`${noPadding ? 'p-4' : ''} mb-2`}>
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className={noPadding ? '' : paddingStyles}>{children}</div>
      {footer && <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 rounded-b-lg">{footer}</div>}
    </div>
  );
};

export default Card;