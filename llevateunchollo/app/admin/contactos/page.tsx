import React from "react";
import prisma from "@/lib/prisma";

async function getContacts() {
  return prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });
}

type ContactRow = Awaited<ReturnType<typeof getContacts>>[number];

export default async function AdminContactosPage() {
  const contacts = await getContacts();
  const unread = contacts.filter((c: ContactRow) => !c.read).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mensajes de contacto</h1>
        <p className="text-gray-500 mt-1">
          {contacts.length} mensajes ({unread} sin leer)
        </p>
      </div>

      <div className="space-y-4">
        {contacts.map((contact: ContactRow) => (
          <div
            key={contact.id}
            className={`bg-white rounded-xl border p-6 ${
              !contact.read ? "border-orange-200 bg-orange-50/30" : "border-gray-100"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {contact.name}
                  </h3>
                  {!contact.read && (
                    <span className="inline-block w-2 h-2 bg-orange-500 rounded-full" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-1">{contact.email}</p>
                {contact.phone && (
                  <p className="text-sm text-gray-500 mb-2">{contact.phone}</p>
                )}
                <p className="font-medium text-gray-800 mb-2">
                  {contact.subject}
                </p>
                <p className="text-gray-600 text-sm whitespace-pre-line">
                  {contact.message}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400">
                  {new Date(contact.createdAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(contact.createdAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">No hay mensajes aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
