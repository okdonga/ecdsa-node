import SlideInToast from "./SlideInToast";

function ToastContainer({ toasts }) {
    return (
      <div className="ToastContainer">
        {toasts.map((toast) => (
          <div
            key={toast.id}
          >
            <SlideInToast {...toast} />
          </div>
        ))}
      </div>
    );
  }

export default ToastContainer;