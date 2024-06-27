import {ButtonHTMLAttributes, FC, ReactNode} from "react";
import clsx from "clsx";

interface ITouchButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
}

export const TouchButton: FC<ITouchButton> = ({children, className, ...rest}) => {
  return <button
    type="button"
    className={clsx("p-2 bg-gray-700 text-white font-bold rounded shadow-md hover:bg-gray-600 text-xs h-12",className)}
    {...rest}
  >
    {children}
  </button>
}