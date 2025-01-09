import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteInvoice } from "@/app/lib/actions";

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  return (
    <form action={deleteInvoiceWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}





/**
 * 
 * ./app/ui/invoices/buttons.tsx:31:11
Type error: Type '() => Promise<{ message: string; }>' is not assignable to type 'string | ((formData: FormData) => void | Promise<void>) | undefined'.
  Type '() => Promise<{ message: string; }>' is not assignable to type '(formData: FormData) => void | Promise<void>'.
    Type 'Promise<{ message: string; }>' is not assignable to type 'void | Promise<void>'.
      Type 'Promise<{ message: string; }>' is not assignable to type 'Promise<void>'.
        Type '{ message: string; }' is not assignable to type 'void'.

  29 |   const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  30 |   return (
> 31 |     <form action={deleteInvoiceWithId}>
     |           ^
  32 |       <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
  33 |         <span className="sr-only">Delete</span>
  34 |         <TrashIcon className="w-4" />
Static worker exited with code: 1 and signal: null
 ELIFECYCLE  Command failed with exit code 1.


export function DeleteInvoice({ id }: { id: string }) {
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        await deleteInvoice(id);
      }}
    >
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}



based on the error, the server action is returning something-- object of

Type '{ message: string; }'
though, next.js 15 form actions must return void or Promise as this is a server side execution rather. hence the rest of the error:

is not assignable to type '(formData: FormData) => void | Promise<void>'


 */