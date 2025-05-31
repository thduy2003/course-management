'use client'
import { useState } from 'react';
import { Input, Button } from 'antd';
import Table from '../../components/Table';
import type { ColumnsType } from 'antd/es/table';

interface ClassItem {
  classId: string;
  courseId: string;
  className: string;
  time: string;
  location: string;
}

const mockClasses: ClassItem[] = [
  {
    classId: 'LH0002',
    courseId: 'KH0001',
    className: 'Tiếng Anh Cơ Bản 1 Lớp 2',
    time: 'Thứ 3, 5, 7 | 17h - 19h\n01/04 - 24/05/2025',
    location: 'Trung tâm',
  },
  {
    classId: 'LH0005',
    courseId: 'KH0002',
    className: 'Tiếng Anh Cơ Bản 2 Lớp 2',
    time: 'Thứ 3, 5, 7 | 17h - 19h\n03/06 - 26/07/2025',
    location: 'Trung tâm',
  },
  {
    classId: 'LH0025',
    courseId: 'KH0018',
    className: 'Tiếng Anh TOEIC 500+ Lớp 1',
    time: 'Thứ 2, 4, 6 | 17h - 19h\n02/04 - 25/04/2025',
    location: 'Trung tâm',
  },
];

const columns: ColumnsType<ClassItem> = [
  {
    title: <span className="text-blue-500">ID Lớp học</span>,
    dataIndex: 'classId',
    key: 'classId',
    align: 'center',
  },
  {
    title: <span className="text-blue-500">ID_KhoáHọc</span>,
    dataIndex: 'courseId',
    key: 'courseId',
    align: 'center',
  },
  {
    title: <span className="text-blue-500">Tên lớp học</span>,
    dataIndex: 'className',
    key: 'className',
    align: 'center',
  },
  {
    title: <span className="text-blue-500">Thời gian</span>,
    dataIndex: 'time',
    key: 'time',
    align: 'center',
    render: (text: string) => <span className="whitespace-pre-line">{text}</span>,
  },
  {
    title: <span className="text-blue-500">Địa điểm</span>,
    dataIndex: 'location',
    key: 'location',
    align: 'center',
  },
];

export default function ClassManagement() {
  const [search, setSearch] = useState('');
  const filtered = mockClasses.filter(
    c =>
      c.classId.toLowerCase().includes(search.toLowerCase()) ||
      c.courseId.toLowerCase().includes(search.toLowerCase()) ||
      c.className.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-blue-500 mb-4">QUẢN LÝ LỚP HỌC</h2>
      <div className="flex items-center gap-4 mb-4">
        <span className="font-semibold text-base">Tìm kiếm:</span>
        <Input
          placeholder="..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-md"
          allowClear
        />
        <Button className="ml-auto px-8 h-10 text-lg font-semibold bg-blue-100 border-blue-200 text-blue-500 hover:bg-blue-200">Thêm kết quả học tập</Button>
      </div>
      <div className="bg-white rounded-xl shadow p-0 overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filtered.map((c, i) => ({ ...c, key: i }))}
          pagination={{
            current: 1,
            pageSize: 10,
            total: filtered.length,
            showSizeChanger: false,
          }}
        />
      </div>
    </div>
  );
} 