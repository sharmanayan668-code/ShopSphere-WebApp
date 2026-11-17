import { Link } from "react-router-dom";
import notFoundImage from "./assets/not-found.svg";

function NotFound() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center bg-slate-100 px-4 py-8 text-center sm:min-h-[75vh] sm:px-5">
      <img src={notFoundImage} alt="404 Page Not Found" className="mb-4 w-[180px] max-w-full object-contain sm:mb-5 sm:w-[270px] md:w-80" />
      <h1 className="m-0 !text-5xl font-extrabold leading-tight text-blue-700 sm:!text-[60px] md:!text-[72px]">404</h1>
      <h2 className="my-3 !text-xl font-bold text-slate-900 sm:!text-2xl md:!text-[28px]">Page Not Found</h2>
      <p className="my-2 mb-5 max-w-[450px] text-sm leading-relaxed text-slate-500 sm:text-base">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="inline-block rounded-lg bg-blue-700 px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-lg sm:text-base"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;