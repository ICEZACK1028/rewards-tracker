import React from 'react';

export function Table({ children }: { children: React.ReactNode }) {
    return <table className="w-full border-collapse border">{children}</table>;
}

export function TableHeader({ children }: { children: React.ReactNode }) {
    return <thead className="bg-gray-200">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
    return <tbody>{children}</tbody>;
}

export function TableRow({ children }: { children: React.ReactNode }) {
    return <tr className="border">{children}</tr>;
}

export function TableHead({ children }: { children: React.ReactNode }) {
    return <th className="p-2 border bg-gray-100 text-left">{children}</th>;
}

export function TableCell({ children }: { children: React.ReactNode }) {
    return <td className="p-2 border">{children}</td>;
}
