'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '../context/UserContext';
import { menu as studentMenu, adminMenu } from '../mock/menu';
import { JSX } from 'react';

const icons: Record<string, JSX.Element> = {
  book: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" />
      <path d="M16 2v20" stroke="currentColor" />
    </svg>
  ),
  study: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4" stroke="currentColor" />
      <path d="M6 21v-2a4 4 0 018 0v2" stroke="currentColor" />
    </svg>
  ),
  complaint: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="3" y="8" width="18" height="13" rx="2" stroke="currentColor" />
      <path d="M8 8V6a4 4 0 118 0v2" stroke="currentColor" />
    </svg>
  ),
  user: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4" stroke="currentColor" />
      <path d="M6 21v-2a4 4 0 018 0v2" stroke="currentColor" />
    </svg>
  ),
  class: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="3" y="8" width="18" height="10" rx="2" stroke="currentColor" />
      <path d="M7 8V6a5 5 0 0110 0v2" stroke="currentColor" />
    </svg>
  ),
  heart: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M12 21C12 21 4 13.5 4 8.5C4 5.5 6.5 3 9.5 3C11.24 3 12.91 4.01 13.44 5.61C13.97 4.01 15.64 3 17.38 3C20.38 3 22.88 5.5 22.88 8.5C22.88 13.5 15 21 15 21H12Z" stroke="currentColor" />
    </svg>
  ),
  support: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
      <path d="M8 15h.01M12 15h.01M16 15h.01" stroke="currentColor" />
    </svg>
  ),
  contract: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" />
      <path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" />
    </svg>
  ),
  report: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" />
      <path d="M7 17v-6M12 17v-2M17 17v-8" stroke="currentColor" />
    </svg>
  ),
};

const menuByRole = {
  'Học Viên': studentMenu,
  'Giảng Viên': [
    { icon: 'class', label: 'Quản lý lớp học', route: '/class-management' },
    { icon: 'user', label: 'Quản lý tài khoản giảng viên', route: '/teacher-account-management' },
  ],
  'Quản Lí Viên': adminMenu,
};

export default function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();
  // const router = useRouter();

  if (!user) {
    return null;
  }
  const menuItems = menuByRole[user.role] || [];
  return (
    <aside className="bg-white rounded-2xl p-8 w-full max-w-xs flex flex-col items-center shadow min-h-[90vh]">
      <img src="/edusys_logo.png" alt="Logo" className="w-24 mb-4" />
      <h1 className="text-blue-500 font-bold text-center text-lg mb-8 leading-tight">
        HỆ THỐNG QUẢN LÝ GIÁO DỤC<br />TIẾNG ANH EDUSYS
      </h1>
      <div className="w-full space-y-6">
        {menuItems.map((item, idx) => {
          const isActive = pathname === item.route;
          return (
            <Link href={item.route} key={idx} legacyBehavior>
              <a className={`flex items-center space-x-4 cursor-pointer px-2 py-2 rounded-lg transition ${isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:text-blue-500'}`}>
                <span>{icons[item.icon]}</span>
                <span className="text-base">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </aside>
  );
} 