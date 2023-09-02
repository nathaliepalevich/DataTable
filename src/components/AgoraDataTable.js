import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Tooltip } from 'antd';
import { EditableCell } from './EditableCell';
import './AgoraDataTable.scss';
import EditableRow from './EditableRow';
import ResizableTitle from './ResizableTitle'
import useColumnSearch from './useColumnSearch';
const AgoraDataTable = () => {
  let dataRows = [];

  for (let i = 1; i < 10; i++) {
    dataRows.push({
      key: i,
      number: i,
    });
  }
const getColumnSearchProps = useColumnSearch


  let defaultColumns = [];
  defaultColumns.push({
    title: '',
    dataIndex: 'number',
    fixed: 'left',
    width: 50,
    editable: false,
    className: 'first-col-align',
  });
  const letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  for (let i = 0; i < 10; i++) {
    defaultColumns.push({
      title: letters[i],
      dataIndex: letters[i],
      editable: true,
      width: parseInt(localStorage.getItem(`${letters[i]}Width`)) || 94,
      ...getColumnSearchProps(letters[i]),
      render: (title) => (
        <Tooltip placement="top" title={title}>
          {title}
        </Tooltip>
      ),
    });
  }

  const [dataSourceRow, setDataSourceRow] = useState(dataRows);
  const [dataSourceCols, setDataSourceCols] = useState(defaultColumns);

  const [count, setCount] = useState(0);
  const [countCols, setCountCols] = useState(1);

  const handleAddRow = () => {
    const lastRow = dataSourceRow[dataSourceRow.length - 1];
    const newData = {
      key: lastRow.key + 1,
      number: lastRow.key + 1,
    };
    setDataSourceRow([...dataSourceRow, newData]);
    setCount(count + 1);
  };

  const search = getColumnSearchProps(letters[0] + countCols)

  const handleAddCol = () => {
    const newData = {
      title: letters[0] + countCols,
      dataIndex: letters[0] + countCols,
      editable: true,
      width:
        parseInt(localStorage.getItem(`${letters[0] + countCols}Width`)) || 94,
      ...search,
    };

    setCountCols(countCols + 1);
    setDataSourceCols([...dataSourceCols, newData]);
  };
  const handleSave = (row) => {
    const newData = [...dataSourceRow];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSourceRow(newData);
  };
  const components = {
    header: {
      cell: ResizableTitle,
    },
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleResize =
    (index) =>
    (e, { size }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      setDataSourceCols(nextColumns);
    };

  useEffect(() => {
    dataSourceCols.forEach((col) => {
      localStorage.setItem(col.dataIndex + 'Width', col.width);
    });
  }, [dataSourceCols]);

  const columns = dataSourceCols.map((col, index) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: handleResize(index),
      }),
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const headerFunctions = () => {
    return (
      <Space wrap>
        <Button
          onClick={handleAddRow}
          style={{
            marginBottom: 5,
          }}
        >
          Add Row
        </Button>
        <Button
          onClick={handleAddCol}
          style={{
            marginBottom: 5,
          }}
        >
          Add Column
        </Button>
      </Space>
    );
  };
  return (
    <div className="table-container">
      <Table
        bordered
        footer={headerFunctions}
        components={components}
        rowClassName={() => 'editable-row agora'}
        dataSource={dataSourceRow}
        columns={columns}
        scroll={{ x: 800, y: 500 }}
        pagination={{
          position: ['bottomRight'],
        }}
      />
    </div>
  );
};

export default AgoraDataTable;
