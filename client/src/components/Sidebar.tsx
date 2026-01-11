import { NavLink } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Jobs', path: '/jobs', icon: '💼' },
  { name: 'Companies', path: '/companies', icon: '🏢' },
  { name: 'Contacts', path: '/contacts', icon: '👥' },
  { name: 'Interviews', path: '/interviews', icon: '📅' },
  { name: 'Documents', path: '/documents', icon: '📄' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
