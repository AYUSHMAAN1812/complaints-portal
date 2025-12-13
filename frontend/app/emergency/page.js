"use client";
import React from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Emer = () => {
  const arr = [
    { name: "New Hostel Office", number: "999999999" },
    { name: "Carpenter", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
    { name: "Plumber", number: "9999999999" },
  ];

  // This function copies the provided text to the clipboard.
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast('Copied to Clipboard!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.warn('🦄 Failed to Copy!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            });
      });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="relative min-h-screen ">
      <div className="absolute min-h-screen inset-0 -z-10  px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] items-center">
      </div>
      <div className="relative flex justify-center items-start pt-10 pb-10 bg-transparent text-white">
          <table className="w-[80vw] border border-gray-200">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-center">Recipient</th>
                <th className="px-4 py-2 text-center">Helpline Number</th>
              </tr>
            </thead>
            <tbody>
              {arr.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-4 py-2 text-center align-middle">{item.name}</td>
                  <td
                    className="px-4 py-2 text-center align-middle cursor-pointer"
                    onClick={() => handleCopy(item.number)}
                  >
                    {item.number}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Emer;
