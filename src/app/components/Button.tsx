"use client"

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    table: number
    button: number
}

const Button = ({ table, button, ...props }: ButtonProps) => {
    return (
        <button { ...props } name={`${table}-${button}`} className="btn-default"></button>
    );
}
 
export default Button;