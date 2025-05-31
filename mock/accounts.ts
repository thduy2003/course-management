export interface Account {
  username: string;
  password: string;
  role: 'Học Viên' | 'Giảng Viên' | 'Quản Lí Viên';
  name: string;
}

export const accounts: Account[] = [
  { username: 'hocvien', password: '123456', role: 'Học Viên', name: 'Nguyễn Văn V' },
  { username: 'giangvien', password: '123456', role: 'Giảng Viên', name: 'Trần Thị B' },
  { username: 'quanli', password: '123456', role: 'Quản Lí Viên', name: 'Nguyễn Văn A' },
]; 