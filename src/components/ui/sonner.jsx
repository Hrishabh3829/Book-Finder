import { Toaster as Sonner } from "sonner";

const Toaster = (props) => {
  return (
    <Sonner
      position="top-center"
      richColors
      toastOptions={{
        className: "rounded-xl",
      }}
      {...props}
    />
  );
};

export { Toaster };
