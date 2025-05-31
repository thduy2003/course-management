'use client';
import { Table as AntdTable, TableProps, PaginationProps } from 'antd';

interface Props<T> extends TableProps<T> {
  pagination?: PaginationProps | false;
}

export default function Table<T extends object>({ columns, dataSource, pagination, ...rest }: Props<T>) {
  return (
    <AntdTable
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      rowKey={(record: any) => record.id || record.key || JSON.stringify(record)}
      {...rest}
    />
  );
} 