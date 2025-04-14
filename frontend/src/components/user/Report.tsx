import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Table, Button, Spin, Typography, Space, Input } from "antd";
import { BACKEND_URL } from "@/utils/backend";
import Papa from "papaparse";
import Cookies from "js-cookie";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { Skeleton } from 'antd';

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}
const { Title, Text } = Typography;
const BasicSkeleton: React.FC = () => <Skeleton />;


const Report = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [ongoing, setOngoing] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<any>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  // Helper function to classify bookings
  useEffect(() => {
    const classifyBookings = () => {
      const now = new Date();
      const upcoming = [];
      const ongoing = [];
      const past = [];
  
      for (const b of bookings) {
        const inTime = new Date(b.inTime);
        const outTime = b.outTime ? new Date(b.outTime) : null;
  
        if (inTime > now) {
          upcoming.push(b);
        } else if (outTime && outTime < now) {
          past.push(b);
        } else {
          ongoing.push(b);
        }
      }
  
      setOngoing(ongoing);
      setPast(past);
      setUpcoming(upcoming);
    }
    classifyBookings();
  }, [bookings]);
  
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/user/report`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        setBookings(res.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);



  const exportCSV = () => {
    const csv = Papa.unparse(
      bookings.map((b) => ({
        "Company Name": b.company || "N/A",
        "Registration Number": b.registrationNumber || "N/A",
        Location: b.location,
        "Vehicle Category": b.category || "N/A",
        "In Time": new Date(b.inTime).toLocaleDateString(),
        "Out Time": new Date(b.outTime).toLocaleDateString() || "-",
        "Total Spent": `₹${b.totalSpent || 0}`,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Report.csv";
    link.click();
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      `${record[dataIndex]}`.toLowerCase().includes(value.toLowerCase()),
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const bookingsColumns = [
    {
      title: "Company",
      dataIndex: "company",
      ...getColumnSearchProps("company"),
    },
    {
      title: "Reg No",
      dataIndex: "registrationNumber",
      ...getColumnSearchProps("registrationNumber"),
    },
    {
      title: "Category",
      dataIndex: "category",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Location",
      dataIndex: "location",
      ...getColumnSearchProps("location"),
    },
    {
      title: "In Time",
      dataIndex: "inTime",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Total Spent",
      dataIndex: "totalSpent",
      render: (val: number) => `₹${val || 0}`,
    }
  ];

  const outTimeColumn = {
    title: "Out Time",
    dataIndex: "outTime",
    render: (date: string) => new Date(date).toLocaleDateString(),
  };

  const pastBookingColumns = [
    ...bookingsColumns.slice(0, 5),
    outTimeColumn,
    ...bookingsColumns.slice(5),
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={2}>Report</Title>
        <Button type="primary" onClick={exportCSV}>
          Export CSV
        </Button>
      </Space>

      {loading ? (
        <div className="flex flex-col items-center justify-around h-screen">
          <Spin size="large" tip="Loading..." />
          <BasicSkeleton />
          <BasicSkeleton />
          <BasicSkeleton />
        </div>
      ) : (
        <>
          <Table
            columns={bookingsColumns}
            dataSource={ongoing}
            rowKey="id"
            pagination={{ pageSize: 6 }}
            bordered
            title={() => (
              <Text strong>Ongoing Bookings</Text>
            )}
            className="my-4"
          />
          <Table
            columns={bookingsColumns}
            dataSource={upcoming}
            rowKey="id"
            pagination={{ pageSize: 6 }}
            bordered
            title={() => (
              <Text strong>Upcoming Bookings</Text>
            )}
            className="my-4"
          />
          <Table
            columns={pastBookingColumns}
            dataSource={past}
            rowKey="id"
            pagination={{ pageSize: 6 }}
            bordered
            title={() => (
              <Text strong>Past Bookings</Text>
            )}
            className="my-4"
          />
        </>
      )}

    </div>
  );
};

export default Report;
