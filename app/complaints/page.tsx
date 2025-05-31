'use client';
import { useState } from 'react';
import Table from '../../components/Table';
import { complaintsMock, Complaint } from '../../mock/complaints';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Form, Input, Button } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SearchOutlined } from '@ant-design/icons';

const PAGE_SIZE = 10;

export default function ComplaintsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Complaints list
  const { data: complaints = [] } = useQuery<Complaint[]>({
    queryKey: ['complaints'],
    queryFn: () => Promise.resolve(complaintsMock),
  });

  // Add complaint mutation
  const addComplaintMutation = useMutation({
    mutationFn: (newComplaint: Complaint) => Promise.resolve(newComplaint),
    onSuccess: (newComplaint) => {
      queryClient.setQueryData<Complaint[]>(['complaints'], (old = []) => [newComplaint, ...old]);
      setSuccessModalOpen(true);
    },
  });

  // Filtered and paginated data
  const filtered = complaints.filter(
    c =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.content.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((c, i) => ({ ...c, key: (page - 1) * PAGE_SIZE + i }));

  const columns: ColumnsType<Complaint> = [
    { title: <span className="text-blue-500">ID_KhieuNai</span>, dataIndex: 'id', key: 'id', align: 'center' },
    { title: <span className="text-blue-500">Nội dung</span>, dataIndex: 'content', key: 'content', align: 'center' },
    { title: <span className="text-blue-500">Ngày gửi</span>, dataIndex: 'date', key: 'date', align: 'center' },
    { title: <span className="text-blue-500">Trạng thái</span>, dataIndex: 'status', key: 'status', align: 'center' },
  ];

  const handleSendComplaint = (values: any) => {
    const newComplaint: Complaint = {
      id: 'KN' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      content: values.content,
      date: values.date,
      status: 'Chờ phản hồi',
    };
    addComplaintMutation.mutate(newComplaint);
    setComplaintModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-blue-500 mb-4">KHIẾU NẠI</h2>
      <div className="flex gap-4 mb-4">
        <button className="flex-1 border border-indigo-600 font-semibold py-2 rounded-lg bg-blue-500 text-white">DANH SÁCH KHIẾU NẠI</button>
        <button className="flex-1 border border-indigo-600 font-semibold py-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">ĐÁNH GIÁ PHẢN HỒI KHIẾU NẠI</button>
      </div>
      <div className="bg-white rounded-xl shadow p-0 overflow-x-auto">
        <div className="flex items-center gap-4 p-4">
          <Input
            placeholder="Tìm kiếm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            prefix={<SearchOutlined />}
            className="max-w-xs"
          />
          <Button
            type="primary"
            className="ml-auto px-8 h-10 text-lg font-semibold bg-blue-500"
            onClick={() => setComplaintModalOpen(true)}
          >
            Gửi khiếu nại
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={paginated}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total: filtered.length,
            onChange: setPage,
            showSizeChanger: false,
          }}
        />
      </div>
      {/* Complaint Modal */}
      <Modal
        title={<div className="text-xl font-bold text-blue-500 text-center">GỬI KHIẾU NẠI</div>}
        open={complaintModalOpen}
        onCancel={() => setComplaintModalOpen(false)}
        footer={null}
        centered
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            studentId: 'HV0001',
            date: new Date().toLocaleDateString('vi-VN'),
            content: '',
          }}
          onFinish={handleSendComplaint}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="ID Học viên" name="studentId" className="mb-2">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Ngày gửi" name="date" className="mb-2">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Nội dung" name="content" className="mb-2 md:col-span-2" rules={[{ required: true, message: 'Vui lòng nhập nội dung khiếu nại!' }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
          </div>
          <div className="flex justify-center mt-4">
            <Button type="primary" htmlType="submit" className="w-1/2 h-10 text-lg font-semibold bg-blue-500">Gửi khiếu nại</Button>
          </div>
        </Form>
      </Modal>
      {/* Success Modal */}
      <Modal
        title={<div className="text-xl font-bold text-blue-500 text-center">GỬI KHIẾU NẠI</div>}
        open={successModalOpen}
        onCancel={() => setSuccessModalOpen(false)}
        footer={null}
        centered
        width={500}
      >
        <div className="text-center text-lg py-8">Gửi khiếu nại thành công!</div>
      </Modal>
    </div>
  );
} 