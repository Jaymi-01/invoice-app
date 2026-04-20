import logo from '../assets/logo.svg'
import { Sun, Moon } from '@phosphor-icons/react'

interface HeaderProps {
  isDark: boolean
  onToggleTheme: () => void
}

const Header = ({ isDark, onToggleTheme }: HeaderProps) => {
  return (
    <header className="flex h-[72px] items-center bg-bg-header pr-6 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-[103px] lg:flex-col lg:rounded-r-[20px] lg:pr-0 lg:pb-6 z-50">
      <div className="relative h-[72px] w-[72px] lg:h-[103px] lg:w-[103px] cursor-pointer">
        <img 
          src={logo} 
          alt="Invoice Logo" 
          className="h-full w-full object-contain" 
        />
      </div>

      <div className="ml-auto flex items-center lg:mt-auto lg:ml-0 lg:w-full lg:flex-col">
        <button 
          onClick={onToggleTheme}
          className="mr-6 lg:mr-0 lg:mb-8 cursor-pointer focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <Sun weight="fill" size={24} className="text-[#7E88C3]" />
          ) : (
            <Moon weight="fill" size={24} className="text-[#7E88C3]" />
          )}
        </button>

        <div className="mr-6 h-[72px] w-[1px] bg-[#494E6E] lg:mr-0 lg:mb-6 lg:h-[1px] lg:w-full"></div>

        <div className="cursor-pointer">
          <div className="h-10 w-10 lg:h-12 lg:w-12 overflow-hidden rounded-full border-2 border-transparent">
            <img
              src="https://res.cloudinary.com/dquzcqxcy/image/upload/v1776184989/gxzqbtu81te2wdbgoxgl.png"
              alt="User Avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
