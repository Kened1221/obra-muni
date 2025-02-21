"use client";

import { useState, useEffect, useMemo } from "react";
import { getObras } from "@/actions/obras-actions";
import { deleteObra } from "@/actions/formulario-actions";
import { Button } from "@/components/buttons/button";
import {
  FaRegTrashAlt,
  FaUserPlus,
  FaEdit,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import RegisterUsuario from "@/components/views/register-user";
import toasterCustom from "@/components/toaster-custom";
import { ConfirmDialog } from "@/components/dialog/dialog-confirm";
import MapsUpdate from "@/components/maps/maps-update";
import CalendarObra from "@/components/views/update-calendarObra";

interface Obra {
  id: string;
  state: string;
  propietario_id: string;
  resident: string;
  supervisor: string;
  projectType: string;
  obraType: string;
  cui: string;
  name: string;
  areaOrLength: string;
  points: [number, number][];
  fechaFinal: string;
}

export function FormularioContainer() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const [modalU, setModalU] = useState(false);
  const [modalE, setModalE] = useState(false);
  const [idData, setIdData] = useState<string>("");
  const [modalDelete, setModalDelete] = useState(false);
  const [obraSeleccionada, setObraSeleccionada] = useState<Obra>({
    id: "",
    state: "",
    propietario_id: "",
    resident: "",
    supervisor: "",
    projectType: "",
    obraType: "",
    cui: "",
    name: "",
    areaOrLength: "",
    points: [],
    fechaFinal: "",
  });

  const [modalFecha, setModalFecha] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getObras();

        setObras(
          data.map((obra) => ({
            ...obra,
            propietario_id: obra.propietario_id ?? "",
            resident: obra.resident || "No asignado",
            supervisor: obra.supervisor || "No asignado",
            fechaFinal: new Date(obra.fechaFinal).toISOString().split("T")[0],
          }))
        );
      } catch (error) {
        console.error("Error obteniendo obras:", error);
      }
    };

    fetchData();
  }, []);

  const eliminarObra = (id: string) => {
    setIdData(id);
    setModalDelete(true);
  };

  const confirmacionDelete = async () => {
    try {
      const response = await deleteObra(idData);
      if (response.status === 200) {
        toasterCustom(200, "Obra eliminada exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toasterCustom(400, "Error eliminando la obra");
      }
    } catch {
      toasterCustom(500, "Error inesperado al eliminar la obra");
    }
    setModalDelete(false);
  };

  const registrarUsuario = (id: string) => {
    const obraSeleccionada = obras.find((obra) => obra.id === id);
    if (obraSeleccionada) {
      setIdData(id);
      setObraSeleccionada(obraSeleccionada);
      setModalU(true);
    }
  };

  const EditarObra = (id: string) => {
    const obraSeleccionada = obras.find((obra) => obra.id === id);
    if (obraSeleccionada) {
      setIdData(id);
      setObraSeleccionada(obraSeleccionada);
      setModalE(true);
    }
  };

  const actualizarFecha = (id: string) => {
    const obraSeleccionada = obras.find((obra) => obra.id === id);

    if (obraSeleccionada) {
      setIdData(id);
      setObraSeleccionada(obraSeleccionada);
      setModalFecha(true);
    }
  };

  const filteredObras = useMemo(() => {
    return obras.filter((obra) =>
      obra.name.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [obras, filtro]);

  const columns: ColumnDef<Obra>[] = [
    {
      accessorKey: "name",
      header: "Nombre de la obra",
      cell: ({ row }) => (
        <div className="w-full max-w-xl overflow-hidden text-ellipsis whitespace-nowrap truncate">
          {row.original.name}
        </div>
      ),
    },
    { accessorKey: "cui", header: "CUI" },
    { accessorKey: "fechaFinal", header: "Finalización" },
    { accessorKey: "obraType", header: "Obra" },
    { accessorKey: "resident", header: "Residente" },
    { accessorKey: "supervisor", header: "Supervisor" },
    { accessorKey: "state", header: "Estado" },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            size="icon"
            title="Registrar Usuario"
            onClick={() => registrarUsuario(row.original.id)}
          >
            <FaUserPlus className="w-5 h-5" />
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            size="icon"
            title="Editar Obra"
            onClick={() => EditarObra(row.original.id)}
          >
            <FaEdit className="w-5 h-5" />
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            size="icon"
            title="Eliminar Obra"
            onClick={() => actualizarFecha(row.original.id)}
          >
            <FaCalendarAlt className="w-5 h-5" />
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            size="icon"
            title="Eliminar Obra"
            onClick={() => eliminarObra(row.original.id)}
          >
            <FaRegTrashAlt className="w-5 h-5" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredObras,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col w-full h-screen p-6 gap-6">
      <div className="flex-grow w-full overflow-auto bg-background border rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Administrador de obras
        </h2>

        <div className="flex items-center py-4 gap-4">
          <Input
            placeholder="Buscar obra..."
            className="max-w-sm"
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No hay resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {modalU && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <RegisterUsuario  obra={obraSeleccionada} setModalU={setModalU} />
        </div>
      )}

      {modalE && obraSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <MapsUpdate obra={obraSeleccionada} setModal={setModalE} />
        </div>
      )}

      {modalFecha && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CalendarObra
            id={idData}
            fecha={obraSeleccionada.fechaFinal}
            setModalFecha={setModalFecha}
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        onConfirm={confirmacionDelete}
        title="¿Eliminar obra?"
        description="Esta acción no se puede deshacer."
      />
    </div>
  );
}

export default FormularioContainer;
