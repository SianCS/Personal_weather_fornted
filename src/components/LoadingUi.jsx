import React from 'react';

const LoadingUi = ({ text = "กำลังโหลด..." }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500">
    <span className="loading loading-dots loading-lg"></span>
    <p className="mt-2">{text}</p>
  </div>
);

export default LoadingUi;
