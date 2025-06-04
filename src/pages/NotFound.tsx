
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Lỗi 404: Người dùng đã cố truy cập tuyến đường không tồn tại:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Không tìm thấy trang</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Quay về Trang chủ
        </a>
      </div>
    </div>
  );
};

export default NotFound;
