import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

export default function CategoryForm(){
  const [name, setName] = useState('')
  const nav = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        // const { data } = await api.get(`/categories/${id}`)
        // setName(data.name)
        // MOCK
        setName(id === '1' ? 'Electronics' : 'Stationery')
      } catch (e) { console.error(e) }
    }
    load()
  }, [id])

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (id) {
        // await api.put(`/categories/${id}`, { name })
      } else {
        // await api.post('/categories', { name })
      }
      nav('/categories')
    } catch (e) { console.error(e) }
  }

  return (
    <form onSubmit={submit} className="max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-lg font-medium mb-4">{id ? 'Edit Category' : 'New Category'}</h2>
      <label className="block mb-4">Name
        <input value={name} onChange={e=>setName(e.target.value)} className="w-full border px-3 py-2 rounded mt-1" />
      </label>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
        <button type="button" className="px-4 py-2 bg-gray-100 rounded" onClick={()=>nav('/categories')}>Cancel</button>
      </div>
    </form>
  )
}
