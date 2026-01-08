import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className='px-4 py-3 flex justify-center items-center'>
      <h2 className='text-2xl font-semibold mr-10'>Expense Tracker</h2>
      <nav className='flex items-center gap-3'>
        <NavLink to='/dashboard'>Home</NavLink>
        <NavLink to='/income'>Income</NavLink>
        <NavLink to='/expense'>Expense</NavLink>
      </nav>
    </header>
  )
}

export default Navbar