'use client'

import { useState } from 'react'
import { Edit2, Save, X } from 'lucide-react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type Column = {
  name: string
  type: string
  description: string
}

type DatabaseTableProps = {
  name: string
  columns: Column[]
}

export default function DatabaseTable({ name, columns: initialColumns }: DatabaseTableProps) {
  const [columns, setColumns] = useState(initialColumns)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedDescription, setEditedDescription] = useState('')

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditedDescription(columns[index].description)
  }

  const handleSave = (index: number) => {
    const newColumns = [...columns]
    newColumns[index] = { ...newColumns[index], description: editedDescription }
    setColumns(newColumns)
    setEditingIndex(null)
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setEditedDescription('')
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columns.map((column, index) => (
                <TableRow key={column.name}>
                  <TableCell>{column.name}</TableCell>
                  <TableCell>{column.type}</TableCell>
                  <TableCell>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full bg-gray-700 text-gray-100 rounded px-2 py-1"
                      />
                    ) : (
                      column.description
                    )}
                  </TableCell>
                  <TableCell>
                    {editingIndex === index ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave(index)}
                          className="text-green-400 hover:text-green-300"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
