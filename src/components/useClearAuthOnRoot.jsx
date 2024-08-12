// // src/hooks/useClearAuthOnRoot.js
// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const useClearAuthOnRoot = () => {
//   const location = useLocation();
//   const route= useContext(AuthContext);

//   useEffect(() => {
//     if (location.pathname === '/') {
//       route.clearAuthValues();
//     }
//   }, [location.pathname, clearAuthValues]);
// };

// export default useClearAuthOnRoot;
