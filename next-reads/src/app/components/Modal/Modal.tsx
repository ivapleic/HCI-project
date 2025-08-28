import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className=" mg-10 fixed inset-0 z-50 flex items-center justify-center bg-[black] p-6 bg-opacity-50">
      <div className="relative bg-[#F2F2F2] w-full max-w-lg mx-auto p-6 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl w-10 h-10 flex items-center justify-center rounded-full "
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
