"use client";

export function Input({ name, type, defaultValue = "", required = true }) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      autoComplete={name}
      defaultValue={defaultValue}
      className="block w-full rounded-md bg-background px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-primary focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
    />
  );
}

export function Select({ name, required = true, children }) {
  return (
    <select
      name={name}
      required={required}
      className="block bg-background w-full  rounded-md px-3 py-1.5 outline outline-primary sm:text-sm/6"
    >
      {children}
    </select>
  );
}
