import Link from 'next/link'

interface HeaderProps {
  page?: string
}

const Header: React.FC<HeaderProps> = ({ page }) => {
  return (
    <>
      <header className="relative z-10 flex items-center w-full bg-primary-700 text-white px-12 shadow-lg">
        <Link href="/">
          <a className="text-2xl font-extralight tracking-wide">
            <div
              className={`pb-2 pt-4 px-3 drop-shadow-sm border-b-4 ${
                page === 'home' ? ' border-gray-300' : 'border-opacity-0'
              }`}
            >
              Home
            </div>
          </a>
        </Link>
      </header>
    </>
  )
}

export default Header
