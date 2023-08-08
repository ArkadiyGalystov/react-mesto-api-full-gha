import React from 'react';
import { Navigate } from 'react-router-dom';

/** компонент защищает роут /, чтобы на него не смогли перейти неавторизованные пользователи */

const ProtectedRoute = ({ element: Component, loggedIn, ...props }) => {
  return loggedIn ? (
    <Component {...props} />
  ) : (
    <Navigate to='/sign-in' replace />
  );
};

export { ProtectedRoute };
