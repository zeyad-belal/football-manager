import { useAuth } from "@/context/AuthContext";
import { ArrowLeftRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const navItems = [
    {
      path: '/dashboard',
      label: 'My Team',
      icon: Home,
    },
    {
      path: '/transfer-market',
      label: 'Transfer Market',
      icon: ArrowLeftRight,
    },
  ];

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative inline-flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-blue-800 shadow-lg'
                      : 'text-blue-100 hover:text-white hover:bg-blue-600'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span className="font-semibold">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;